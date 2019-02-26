import { Injectable } from '@angular/core';

import { UserRank } from '../../interfaces/user-rank.interface';
import { TeamRank } from '../../interfaces/team-rank.interface';

@Injectable()
export class RankingService {

	constructor() { }

	getUserRanking(UserSoloMMR: number, UserPartyMMR: number): UserRank {
		const weighMMR = (w) => {

			if (w <= 1500) {
				return 1;
			} else if (w <= 2500) {
				const x = w - 1500;
				return Math.floor((x / 500) + 1);
			} else if (w <= 3000) {
				const x = w - 2500;
				return Math.floor((x / 125) + 3);
			} else if (w <= 3500) {
				const x = w - 3000;
				return Math.floor((x / 62.5) + 7);
			} else if (w <= 4000) {
				const x = w - 3500;
				return Math.floor((x / 31.25) + 15);
			} else if (w <= 4500) {
				const x = w - 4000;
				return Math.floor((x / 15.625) + 31);
			} else if (w <= 5500) {
				const x = w - 4500;
				return Math.floor((x / 7.8125) + 63);
			} else {
				return 200;
			}
		};
		let usedValue = 0;
		if (UserPartyMMR - 250 > UserSoloMMR) {
			usedValue = UserPartyMMR - 250;
		} else {
			usedValue = UserSoloMMR;
		}

		const divisionCalculation = (mmr) => {
			if (mmr < 3688) {
				return 'C';
			} else if (mmr < 4797) {
				return 'B';
			} else if (mmr < 5102) {
				return 'A';
			} else {
				return 'S';
			}
		};

		const UserWeight: UserRank = {
			points: 0,
			MMR: 0,
			lowestDivision: 'X'
		};

		UserWeight.points = weighMMR(usedValue);
		UserWeight.MMR = usedValue;
		UserWeight.lowestDivision = divisionCalculation(usedValue);
		return UserWeight;
	}
	/**
	 * getTeamRanking to use weighted MMR value.
	 * TeamMMRs array should be populated with UserWeight.points from each teammate
	 * returns TeamRank object with division and points.
	*/
	getTeamRanking(TeamMMRs: number[]): TeamRank {
		const compareNumbers = (a, b) => {
			return b - a;
		};

		TeamMMRs.sort(compareNumbers);

		const Weight1 = TeamMMRs[0];
		const Weight2 = TeamMMRs[1];
		const Weight3 = TeamMMRs[2];
		const Weight4 = TeamMMRs[3];
		const Weight5 = TeamMMRs[4];

		let teamWeight = 0;
		let hasError = false;

		if (Weight1 === 0 || Weight2 === 0 || Weight3 === 0 || Weight4 === 0 || Weight5 === 0) {
			hasError = true;
		} else {
			teamWeight = (Weight1 + Weight2 + Weight3 + Weight4 + Weight5);
		}

		const TeamRank: TeamRank = {
			points: 0,
			division: ''

		};

		TeamRank.points = teamWeight;
		if (hasError) {
			TeamRank.division = 'Error';
			TeamRank.points = -1;
		} else if (teamWeight < 71 && Weight1 < 21) {
			TeamRank.division = 'C';
		} else if (teamWeight < 226 && Weight1 < 101) {
			TeamRank.division = 'B';
		} else if (teamWeight < 581 && Weight1 < 140) {
			TeamRank.division = 'A';
		} else {
			TeamRank.division = 'S';
		}
		return TeamRank;
	}
}
