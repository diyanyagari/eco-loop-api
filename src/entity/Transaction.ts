import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { BankLocation } from "./BankLocation";

@Entity("transactions")
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: "CASCADE" })
  user!: User;

  @ManyToOne(() => BankLocation, (location) => location.transactions, {
    onDelete: "CASCADE",
  })
  location!: BankLocation;

  @Column({ type: "float" })
  weight!: number; // Berat sampah dalam KG

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
