// "Do you come to my area?" Uses the first letters of a Canadian postal code (the FSA).
export type AreaAnswer = { status: "yes" | "likely" | "outside" | "invalid"; message: string };

export function checkPostalCode(input: string): AreaAnswer | null {
  const code = input.toUpperCase().replace(/\s+/g, "");
  if (code.length < 3) return null;
  if (!/^[ABCEGHJ-NPRSTVXY]\d[A-Z]/.test(code)) {
    return { status: "invalid", message: "That doesn't look like a Canadian postal code. Try the first three characters, like M4L or L6J." };
  }
  const fsa = code.slice(0, 3);
  if (fsa[0] === "M") {
    return { status: "yes", message: `Yes. ${fsa} is in Toronto, right in the middle of where I work.` };
  }
  // L1 Durham, L3/L4 York and Peel, L5 Mississauga, L6/L7 Peel, York and Halton, L9 Halton and Caledon.
  if (fsa[0] === "L" && ["1", "3", "4", "5", "6", "7", "9"].includes(fsa[1])) {
    return {
      status: "likely",
      message: `Yes, I cover most of the 905 GTA. Mention your town when you get in touch and I'll confirm for ${fsa}.`,
    };
  }
  return {
    status: "outside",
    message: `${fsa} is outside the area I usually cover. Send me a note anyway: if I can't help, I may know someone who can.`,
  };
}
