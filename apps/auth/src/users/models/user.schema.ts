import { AbstractDocument } from '@app/common/database/abstract.schema';
import { RolesEnum } from '@app/common/enum/roles.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, enum: RolesEnum })
  role: RolesEnum;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
