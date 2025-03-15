import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  username!: string;

  @Column({ type: "text" })
  password!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @Column({ type: "varchar", length: 500, nullable: true })
  current_token!: string | null; // Token aktif
}
