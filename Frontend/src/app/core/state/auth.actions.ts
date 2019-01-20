export class Login {
  static readonly type = '[AUTH] Login User';
  constructor(public payload: { email: string, password: string }) {}
}

export class Register {
  static readonly type = '[AUTH] Register User';
  constructor(public payload: { username: string, email: string, password: string }) {}
}

export class Logout {
  static readonly type = '[AUTH] Logout';
}


export class ChangeMainPhoto {
  static readonly type = '[AUTH] Change Main Photo';
  constructor(public payload: any) {}
}
