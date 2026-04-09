let ioInstance;

export const setIo = (io) => {
  ioInstance = io;
};

export const emitOrderUpdate = (adminId, payload) => {
  if (!ioInstance) return;
  ioInstance.to(`admin:${adminId}`).emit('order:update', payload);
};
