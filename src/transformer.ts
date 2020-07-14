import { entityParser, EntityParser, Entity } from "./parser.ts";

export type TransformersType<T, R extends string> = {
  [K in keyof T]: Transformer<R, Entity & { type: K } & T[K]>;
};

export type Transformer<R, E extends Entity = Entity> = (
  text: string,
  entity: E,
  entities: EntityParser,
) => R;

export const buildEntity = <T, R extends string>(
  transformers: TransformersType<T, R>,
  text: string,
  entity: Entity | undefined,
  entities: EntityParser,
) => {
  if (entity != null) {
    if (entity.type in transformers) {
      return Reflect.get(transformers, entity.type)(text, entity, entities);
    } else {
      console.warn(
        new Error(`Entity type '${entity.type}' is not handled`),
      );
      return text;
    }
  } else {
    return text;
  }
};

export const parseEntities = <T, R extends string>(
  transformers: TransformersType<T, R>,
  entities: EntityParser,
): R[] => {
  const result = [];
  for (const { text, entity } of entities) {
    result.push(buildEntity(transformers, text, entity, entities));
  }
  return result;
};

export function createTransformer<T, R extends string>(
  transformers: TransformersType<T, R>,
) {
  return {
    parse: (entities: EntityParser) => parseEntities(transformers, entities),
  };
}
