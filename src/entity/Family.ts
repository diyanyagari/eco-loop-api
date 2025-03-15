import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("families")
export class Family {
  @PrimaryColumn({ type: "varchar", length: 16 })
  kk_number!: string;

  @Column({ type: "varchar", length: 100 })
  family_name!: string;

  @OneToMany(() => User, (user) => user.family)
  users!: User[];

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
