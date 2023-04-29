import create from "../services/http-service";
import { ProgramData, Program } from "./Program";

export default create<ProgramData, Program>("/programs");
