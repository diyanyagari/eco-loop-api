import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  BeforeInsert,
} from "typeorm";
import { Transaction } from "./Transaction";
import { v4 as uuidv4 } from "uuid";

@Entity("bank_locations")
export class BankLocation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "varchar", length: 50, unique: true })
  qr_code!: string; // ID unik yang akan dipakai buat barcode

  @Column({ type: "varchar", length: 255 })
  address!: string; // Alamat bank location

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @OneToMany(() => Transaction, (transaction) => transaction.location)
  transactions!: Transaction[];

  @BeforeInsert()
  generateQRCode() {
    this.qr_code = uuidv4(); // Generate QR Code otomatis sebelum insert
  }
}
