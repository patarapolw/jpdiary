declare module 'markdown-it-*'
declare module '*.json'

declare module '*.module.scss' {
  const m: Record<string, string>
  export default m
}
