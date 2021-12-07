interface Session {
  userEmail: string;
  sessionId: string;
}

export class Sessions {
  static data: { [key: string]: Session } = {};

  static findBySessionId(sessionId: string): Session | undefined {
    return this.data[sessionId];
  }

  static add(session: Session) {
    this.data[session.sessionId] = session;
  }

  static remove(sessionId: string) {
    if (this.data[sessionId]) {
      delete this.data[sessionId];
      return true;
    }
    return false;
  }
}
