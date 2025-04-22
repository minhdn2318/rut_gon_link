import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Link extends Document {
  @Prop({ required: true, unique: true })
  shortCode: string;

  @Prop({ required: true })
  originalUrl: string;

  @Prop({ default: 0 })
  clicks: number;
}

export const LinkSchema = SchemaFactory.createForClass(Link);