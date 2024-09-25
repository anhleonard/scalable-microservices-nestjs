import { AbstractDocument } from '@app/common/database/abstract.schema';
import { OrderStatus } from '@app/common/enum/order.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Order extends AbstractDocument {
  @Prop()
  products: string[];

  @Prop()
  amount: number;

  @Prop()
  orderDate: Date;

  @Prop({ type: String, enum: OrderStatus })
  status: OrderStatus;

  @Prop()
  address: string;

  @Prop()
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
