export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

export function typedMock<T>(value: DeepPartial<T>): T {
  return value as T
}
