declare global {
  interface Window {
    tokenRefreshTimer?: ReturnType<typeof setTimeout>;
  }
}
export {};