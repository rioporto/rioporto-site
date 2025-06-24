// Polyfill para Edge e navegadores mais antigos
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Polyfill para crypto.randomUUID em navegadores mais antigos
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
  crypto.randomUUID = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };
}

// Prevenir conflitos com extensões de crypto/web3
if (typeof window !== 'undefined') {
  // Proteger contra redefinição de propriedades por extensões
  const ethereumDescriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
  if (ethereumDescriptor && !ethereumDescriptor.configurable) {
    // Ethereum já está definido e não pode ser redefinido
    console.log('Ethereum property already defined by extension');
  }
}

export {};
