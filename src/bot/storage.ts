export class UserFileStorage {
    private files = new Map<number, Buffer>();
  
    store(userId: number, buffer: Buffer) {
      this.files.set(userId, buffer);
    }
  
    get(userId: number) {
      return this.files.get(userId);
    }
  
    delete(userId: number) {
      this.files.delete(userId);
    }
  }
  
  export const fileStorage = new UserFileStorage();