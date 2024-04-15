import { IParticipation } from "./Participation.model";

export interface IOlympic {
    id: string;
    country: string;
    participations: IParticipation[];
}
