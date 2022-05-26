// TODO maybe move types to a separate package?
/**
 * Defines the player's skills
 */
interface PlayerSkills {
  // TODO Maybe type the skill names?
  [key: string]: number;
}

/**
 * Defines the player profile
 */
interface Player {
  id: number;
  name: string;
  age: number;
  country: string;
  club: string;
  skills: PlayerSkills;
  // TODO finish it, e.g. position, form, contract
}

const skillNames = [
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
  const [, clubEl, , ageEl] = bioEl.querySelectorAll("td");

  // economics = financial + status
  const [skillsEl, personalityEl, positionsEl, formEl, economicsEl] = mainEl.querySelectorAll(":scope > div");

  // we are selecting 3n + 2 because each skill is a trio of skill name(1), skill value(2) and a up/down/same image(3)
  const skillValueEls = skillsEl.querySelectorAll(".row1 td:nth-child(3n + 2), .row2 td:nth-child(3n + 2)");
  const skills: PlayerSkills = {};
  for (let i = 0; i < skillNames.length; i++) {
    const skillName = skillNames[i];
    skills[skillName] = Number(skillValueEls[i].textContent);
  }

  return {
    id: Number(idEl.textContent!.replace(/\D+/g, "")),
    name: nameEl.textContent!,
    age: Number(ageEl.textContent!.replace(/\D+/g, "")),
    country: (countryEl as HTMLElement).title,
    club: clubEl!.firstElementChild!.textContent!,
    skills: skills,
  };
};

export default {
  parsePlayer,
};
