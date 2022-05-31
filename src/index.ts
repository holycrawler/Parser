// TODO maybe move types to a separate package?

/**
 * Skill names, from player's profile.
 */
const SKILL_NAMES = [
  // 1st row
  ["reflexes", "tackling", "creativity", "shooting", "teamWork"],
  // 2nd row
  ["oneOnOnes", "marking", "passing", "dribbling", "speed"],
  // 3rd row
  ["handling", "heading", "longShots", "positioning", "strength"],
  // 4th row
  ["communication", "crossing", "firstTouch", "aggression", "influence"],
  // 5th row
  ["eccentricity"],
].flat(1);

/**
 * Defines the player's skills
 */
interface PlayerSkills {
  [key: typeof SKILL_NAMES[number]]: number;
}

/**
 * Defines all the possible player's positions.
 */
type Position = "GK" | "DC" | "DL" | "DR" | "MC" | "ML" | "MR" | "FC" | "FL" | "FR";

/**
 * Defines the mapping of a position with its pixel coordinates in the parent container, for easier lookup.
 * @see getPosition
 */
const POSITION_COORDS: Record<string, Position> = {
  // i stole these from dug-tool
  "69px10px": "GK",
  "69px40px": "DC",
  "20px40px": "DL",
  "117px40px": "DR",
  "69px108px": "MC",
  "20px108px": "ML",
  "117px108px": "MR",
  "69px185px": "FC",
  "20px185px": "FL",
  "117px185px": "FR",
};

/**
 * Returns the player's main position.
 *
 * Note that it concatenates the coordinates for easier lookup.
 *
 * @param positionsEl the positions element
 * @return Position player's main position
 * @see POSITION_COORDS
 */
const getPosition = (positionsEl: Element): Position => {
  const mainPosition = positionsEl.querySelector("div[style*='club/positions-1.png)']") as HTMLElement;
  const coords = mainPosition.style.top + mainPosition.style.left;
  return POSITION_COORDS[coords];
};

/**
 * Defines the player profile.
 */
interface Player {
  id: number;
  name: string;
  age: number;
  country: string;
  club: {
    id: number;
    name: string;
    url: string;
    country: string;
  };
  skills: PlayerSkills;
  experience: number;
  position: Position;
  personalities: string[];
}

/**
 * Parses player's data from an individual player's page.
 * @return Player the player
 */
const parsePlayer = (): Player => {
  /*
   * Get the player's page main elements by selecting the div siblings of #main-1 (which is actually the skillsEl).
   * Note that some div siblings are ignored, hence the extra commas in below destructuring.
   */
  const [headerEl, , bioEl, , mainEl] = document.querySelector("#main-1")!.parentNode!.querySelectorAll(":scope > div");
  const [idEl, countryEl, nameEl] = headerEl.querySelectorAll(":scope .player_id_txt,img,.player_name");
  const [clubCountryEl, clubEl, , ageEl] = bioEl.querySelectorAll("td");
  const clubLinkEl = clubEl.firstElementChild as HTMLAnchorElement;

  // economics = financial + status
  const [skillsEl, personalityEl, positionsEl, formEl, economicsEl] = mainEl.querySelectorAll(":scope > div");
  const xpEl = mainEl.previousElementSibling!.querySelector("div[title*='XP']") as HTMLElement;

  const name = nameEl.textContent!;
  // we are selecting 3n + 2 because each skill is a trio of skill name(1), skill value(2) and a up/down/same image(3)
  const skillValueEls = skillsEl.querySelectorAll(".row1 td:nth-child(3n + 2), .row2 td:nth-child(3n + 2)");
  const skills: PlayerSkills = {};
  for (let i = 0; i < SKILL_NAMES.length; i++) {
    const skillName = SKILL_NAMES[i];
    skills[skillName] = Number(skillValueEls[i].textContent);
  }

  return {
    id: Number(idEl.textContent!.replace(/\D+/g, "")),
    name: name,
    age: Number(ageEl.textContent!.replace(/\D+/g, "")),
    country: (countryEl as HTMLElement).title,
    club: {
      id: Number(clubLinkEl.href.replace(/\D/g, "")),
      name: clubLinkEl.textContent!,
      url: clubLinkEl.href,
      country: clubCountryEl.querySelector("img")!.title,
    },
    skills: skills,
    experience: Number(xpEl.title.replace(/\D+/g, "")),
    position: getPosition(positionsEl),
    personalities: [...personalityEl.querySelectorAll(".row1, .row2")]
      .map((e) => e.textContent!.trim())
      // Needs to match the player's first name, otherwise it's "Your assistant didn't notice blah blah blah"
      .filter((trait) => trait.includes(name.replace(/\s\S+$/, ""))),
  };
};

export default {
  parsePlayer,
};
