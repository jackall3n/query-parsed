import querystring, {
  ParseOptions as QueryParseOptions,
  StringifyOptions as QueryStringifyOptions
} from 'query-string';

type BaseTypes = typeof Boolean | typeof Number | typeof String
type Types = BaseTypes | BaseTypes[]

type IsString<T> = T extends typeof String ? true : T extends string ? true : false;
type IsBoolean<T> = T extends typeof Boolean ? true : false;
type IsNumber<T> = T extends typeof Number ? true : false;

type ParseType<T> =
  IsString<T> extends true ? string :
    IsBoolean<T> extends true ? boolean :
      IsNumber<T> extends true ? number : (string | string[])

export type Parsed<T> = {
  [K in keyof T]: ParseType<T[K]>
}

export type Config = Record<string, Types>;
export type ParseOptions = QueryParseOptions;
export type StringifyOptions = QueryStringifyOptions;

export function parse<C extends Config>(query: string, config?: C, options?: ParseOptions): Parsed<C> {
  const parsed = querystring.parse(query, options) as Parsed<C>;

  const entries = Object.entries(config ?? {})

  if (!entries.length) {
    return parsed;
  }

  return entries.reduce((query, [key, type]) => {
    const value = parsed[key] as string | string[];

    const result = (() => {
      if (!Array.isArray(type)) {
        return type(value)
      }

      if (Array.isArray(value) && Array.isArray(type)) {
        return value.map(v => type[0](v))
      }

      return value
    })()

    return ({
      ...query,
      [key]: result
    })
  }, {} as Parsed<C>)
}

export function stringify(object: Record<string, any>, options?: StringifyOptions) {
  return querystring.stringify(object, options);

}

export function serializeConfig(types: Record<string, Types>) {
  const serialized = Object.entries(types).reduce((serialized, [key, type]) => {
    const typeConstructor = Array.isArray(type) ? type[0] : type;

    const typeString = (() => {
      switch (typeConstructor) {
        case Number:
          return 'Number';
        case String:
          return 'String';
        case Boolean:
          return 'Boolean';
      }

      return 'Unknown'
    })();

    return {
      ...serialized,
      [key]: Array.isArray(type) ? `[]${typeString}` : typeString
    }
  }, {});

  return JSON.stringify(serialized);
}

export function deserializeConfig(serialized: string): Record<string, Types> {
  const json = JSON.parse(serialized) as Record<string, string>;

  return Object.entries(json).reduce((deserialized, [key, type]) => {
    const isArray = type.startsWith('[]');
    const typeString = isArray ? type.substring(2) : type;

    const typeConstructor = (() => {
      switch (typeString) {
        case 'Number':
          return Number;
        case 'String':
          return String;
        case 'Boolean':
          return Boolean;
      }

      return undefined
    })();

    return {
      ...deserialized,
      [key]: isArray ? [typeConstructor] : typeConstructor
    }
  }, {});
}

export default { parse, stringify }
