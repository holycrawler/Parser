const parseClubInfo = () => {
  const flagEl = document.querySelector("img[src*=flags_round]")!; // selecting the big round flag left of the club name
  const lastActiveEl = document.querySelectorAll("td.maninfo")!; // selecting the last

  const [teamNameEl, shortNameEl, StadiumEl, ratingEl, managerEl, , leagueEl, idEl] = document
    .querySelector("div#content_main > div:last-child table")!
    .querySelectorAll("td[class*=matches_row]:nth-child(2)"); // selecting the 2nd column of the "quick facts" table
  const stadium = StadiumEl.textContent!.match(/(.*)\([0-9]*\/([0-9]*)\)/); // extracting the stadium name and capacity

  // this part just checks if the club has any achievements/trophies and maps them to an array
  const trophiesEl = document.querySelector("div#trophy_0")
    ? document.querySelector("div#trophy_0")!.parentElement!.querySelectorAll("img")!
    : null;
  const achivementsEl = document.querySelector("div.achieve")!.nextElementSibling!.querySelectorAll("img");
  const trophies = trophiesEl ? Array.from(trophiesEl!).map((el) => el.getAttribute("title")!) : null;
  const achivements = achivementsEl.length ? Array.from(achivementsEl).map((el) => el.getAttribute("title")!) : null;

  return {
    teamName: teamNameEl.textContent!.trim(),
    shortName: shortNameEl.textContent!.trim(),
    country: flagEl.getAttribute("title")!,
    lastActive: lastActiveEl[5].textContent!.trim(), // i didn't convert this to unix time because it's not a fixed format
    stadium: { name: stadium![1].trim(), capacity: Number(stadium![2]) },
    rating: Number(ratingEl.textContent!.replace(/\D+/g, "")),
    manager: managerEl.textContent!.trim(),
    league: {
      name: leagueEl.firstElementChild!.textContent!,
      url: (leagueEl.firstElementChild as HTMLAnchorElement).href,
    },
    id: Number(idEl.textContent!.replace(/\D+/g, "")),
    trophies: trophies,
    achivements: achivements,
  };
};

export default {
  parseClubInfo,
};