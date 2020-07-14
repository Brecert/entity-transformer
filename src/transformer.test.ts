import { entityParser, EntityParser, Entity } from "./parser.ts";
import { parseEntities, Transformer, TransformersType } from "./transformer.ts";
import { assertEquals } from "https://deno.land/std@0.61.0/testing/asserts.ts";

interface Transformers {
  code: {};
  color: { color: string };
}

const transformers: TransformersType<Transformers, string> = {
  code: (text) => `<code>${text}</code>`,
  color: (text, entity, entities) =>
    `<color#${entity.color}> ${parse(entities).join("")}</color>`,
};

const parse = (entities: EntityParser) => parseEntities(transformers, entities);

const entities = entityParser(
  "hello world",
  [{ type: "code", offset: 0, length: 5 }],
);

Deno.test("transformer #1", () => {
  assertEquals(
    parseEntities(transformers, entities),
    ["<code>hello</code>", " world"],
  );
});

Deno.test("transformer #2", () => {
  const entities = entityParser(
    "hello world",
    [],
  );
  assertEquals(
    parse(entities),
    ["hello world"],
  );
});

Deno.test("transformer #3", () => {
  const unparsedEntities = [{
    type: "color" as const,
    offset: 5,
    length: 0,
    color: "#333",
  }, {
    type: "code" as const,
    offset: 5,
    length: 5,
  }];
  const entities = entityParser(
    "hello world",
    unparsedEntities,
  );
  assertEquals(
    parse(entities),
    ["hello", "<color##333> <code> worl</code>d</color>"],
  );
});
