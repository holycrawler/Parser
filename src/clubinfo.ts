export interface ClubInfo {
  teamName: string;
  shortName: string;
  country: string;
  lastActive: string;
  stadium: {
    name: string;
    capacity: number;
  };
  rating: number;
  manager: string;
  league: {
    name: string;
    url: string;
  };
  id: number;
  trophies: string[];
  achievements: string[];
}

export const parseClubInfo = (): ClubInfo => {
  const flagEl = document.querySelector("img[src*='images/flags_round']") as HTMLImageElement; // selecting the big round flag left of the club name
  const lastActiveEl = document.querySelectorAll("td.maninfo") as NodeListOf<HTMLTableCellElement>; // selecting the last

  const [teamNameEl, shortNameEl, StadiumEl, ratingEl, managerEl, , leagueEl, idEl] = (
    document.querySelector("div#content_main > div:last-child table") as HTMLTableElement
  ).querySelectorAll("td[class*=matches_row]:nth-child(2)") as NodeListOf<HTMLTableCellElement>; // selecting the 2nd column of the "quick facts" table

  const stadium = StadiumEl.textContent!.match(/(.*)\([0-9]*\/([0-9]*)\)/)!; // extracting the stadium name and capacity
  const leagueLinkEl = leagueEl.firstElementChild as HTMLAnchorElement;

  const trophiesEl = document.querySelectorAll("img[src*='images/club/cups']") as NodeListOf<HTMLImageElement>;
  const achievementsEl = document.querySelectorAll("img[src*='images/trophies']") as NodeListOf<HTMLImageElement>;
  const trophies = Array.from(trophiesEl!).map((el) => el.getAttribute("title")!);
  const achievements = Array.from(achievementsEl).map((el) => el.getAttribute("title")!);

  return {
    teamName: teamNameEl.textContent!.trim(),
    shortName: shortNameEl.textContent!.trim(),
    country: flagEl.getAttribute("title")!,
    lastActive: lastActiveEl[5].textContent!.trim(), // I didn't convert this to unix time because it's not a fixed format
    stadium: { name: stadium[1].trim(), capacity: Number(stadium[2]) },
    rating: Number(ratingEl.textContent!.replace(/\D+/g, "")),
    manager: managerEl.textContent!.trim(),
    league: {
      name: leagueLinkEl.textContent!,
      url: leagueLinkEl.href,
    },
    id: Number(idEl.textContent!.replace(/\D+/g, "")),
    trophies,
    achievements,
  };
};

export default {
  parseClubInfo,
};
