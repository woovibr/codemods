export interface IUserNotification extends Document {
  user?: Types.ObjectId;
  candidate?: Types.ObjectId;
  creator?: Types.ObjectId;
  company: Types.ObjectId;
}
