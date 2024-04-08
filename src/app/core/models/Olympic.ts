import { IParticipation } from "./Participation";

export interface IOlympic {
    id: string;
    country: string;
    participations: IParticipation[];
}
