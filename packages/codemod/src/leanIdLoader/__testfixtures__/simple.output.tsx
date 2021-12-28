export default class Engagement {
  id: string;
  _id: Types.ObjectId;

  constructor(data) {
    this.id = data.id || data._id;
    this._id = data._id;
  }
}
