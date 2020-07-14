// @ts-nocheck
import { entityParser } from "./parser.ts";
import { parseEntities } from "./transformer.ts";
import { assertEquals } from "https://deno.land/std@0.61.0/testing/asserts.ts";

const data = {
  text: "**bold** normal __underline **bold**__ red&normal",
  entities: [
    {
      type: "bold",
      offset: 0,
      length: 8,
    },
    {
      type: "underline",
      offset: 16,
      length: 22,
      children: [{
        type: "bold",
        offset: 12,
        length: 8,
      }],
    },
    {
      type: "color",
      offset: 39,
      length: 0,
      color: "red",
    },
  ],
};

Deno.test("parser #1", () => {
  const entities = entityParser(
    data.text,
    data.entities,
  );
  assertEquals(entities.next().value, {
    text: "**bold**",
    entity: {
      type: "bold",
      offset: 0,
      length: 8,
    },
  });
  assertEquals(entities.next().value, {
    text: " normal ",
    entity: undefined,
  });
  assertEquals(entities.next().value, {
    text: "__underline **bold**__",
    entity: data.entities[1],
  });
});

Deno.test("transformer #1", () => {
  const transformers = {
    bold: (text, entity, entities) => `(b '${build(text, entity, entities)}')`,
    underline: (text, entity, entities) =>
      `(u '${build(text, entity, entities)}')`,
    color: (text, entity, entities) =>
      `(#${entity.color} '${parse(entities)}')`,
  };

  const parse = (entities) => parseEntities(transformers, entities);

  const build = (text, entity) => {
    if (entity.children != null) {
      return parse(entityParser(text, entity.children)).join("");
    } else if (text != null) {
      return text;
    } else {
      return entity.text;
    }
  };

  const entities = entityParser(
    data.text,
    data.entities,
  );

  assertEquals(
    parse(entities),
    [
      "(b '**bold**')",
      " normal ",
      "(u '__underline (b '**bold**')__')",
      " ",
      "(#red 'red&normal')",
    ],
  );
});
