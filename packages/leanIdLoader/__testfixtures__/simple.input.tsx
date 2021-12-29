export default class Engagement {
  id: string;
  _id: Types.ObjectId;

  constructor(data) {
    this.id = data.id;
    this._id = data._id;
  }
}
