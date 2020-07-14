export interface Entity {
  type: string;
  offset: number;
  length: number;
  children?: Entity;
}

/**
 * 
 * @param text the stripped of formatting source string
 * @param entities the formatting entities
 */
export function* entityParser<E extends Entity>(text: string, entities: E[]) {
  let lastOffset = 0;
  const len = entities.length;
  let i = 0;

  for (i; i < len; i++) {
    const entity = entities[i];

    if (entity.offset > lastOffset) {
      yield {
        text: text.slice(lastOffset, entity.offset),
        entity: undefined,
      };
    }

    const entityText = text.substr(entity.offset, entity.length);

    lastOffset = entity.offset + entity.length;

    yield {
      text: entityText,
      entity: entity,
    };
  }

  yield {
    text: text.slice(lastOffset),
    entity: undefined,
  };

  return i;
}

export type EntityParser = ReturnType<typeof entityParser>;
