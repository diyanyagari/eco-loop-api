import { MinLength } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Family } from "./Family";
import { Transaction } from "./Transaction";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 16, unique: true })
  nik!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 15, unique: true, nullable: true })
  phone!: string;

  @Column({ type: "varchar", length: 100, unique: true, nullable: true })
  email!: string;

  @Column({ type: "text" })
  password!: string;

  @ManyToOne(() => Family, (family) => family.users, { onDelete: "CASCADE" })
  family!: Family;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions!: Transaction[];

  @Column({ type: "timestamp", nullable: true })
  latest_login!: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  current_token!: string | null; // Token aktif

  // Hook to set the timestamps and is_active before insert
  @BeforeInsert()
  setDefaultValuesBeforeInsert() {
    const now = new Date(); // Get the current time in ISO format
    this.created_at = now;
    this.updated_at = now;
    this.latest_login = now; // Set the last login time to now
  }

  // Optionally, you can use this hook for updates to set the updated_at field
  @BeforeUpdate()
  updateTimestamps() {
    this.updated_at = new Date();
  }
}
