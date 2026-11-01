// All business copy and facts live here so they can be edited in one place.
// Anything marked TODO or PLACEHOLDER needs confirming with Shannon before launch (see README).

import type { Plan } from "@/components/PlanSlider/types";

export const site = {
  name: "Shannon Boudreau Gardens",
  person: "Shannon Boudreau",
  firstName: "Shannon",
  url: "https://shannon-garden.vercel.app", // TODO replace with the real domain
  phone: "(416) 555-0142", // TODO confirm
  phoneHref: "tel:+14165550142", // TODO confirm
  email: "hello@example.com", // TODO confirm
  // Paid garden work only. Keep it modest: "3+" or "3-4". Don't use bigger numbers anywhere.
  yearsProfessional: "3+", // TODO confirm "3+" or "3-4"
  education: {
    firstField: "International Development",
    secondField: "TODO confirm", // TODO confirm the second field of the double degree
  },
  responseTime: "within two working days", // TODO confirm
  seasonNote: "I book spring visits from February. Care rounds run April to November.", // TODO confirm
  legalUpdated: "1 November 2026", // update whenever /privacy or /terms change
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

// TODO confirm the regions and towns Shannon covers. The postal checker on /contact uses these too.
export const gtaRegions = [
  { name: "City of Toronto", short: "Toronto", places: "Old Toronto, East York, York, North York, Etobicoke, Scarborough" },
  { name: "Durham Region", short: "Durham", places: "Pickering, Ajax, Whitby, Oshawa" },
  { name: "York Region", short: "York", places: "Vaughan, Markham, Richmond Hill, Aurora, Newmarket" },
  { name: "Peel Region", short: "Peel", places: "Mississauga, Brampton, Caledon" },
  { name: "Halton Region", short: "Halton", places: "Oakville, Burlington, Milton, Halton Hills" },
] as const;

export const approach = [
  {
    title: "Soil first",
    body: "Before anything goes in the ground I look at what it's going into: texture, drainage, compaction, what the last owner left behind. Most city soil needs feeding, not replacing.",
  },
  {
    title: "Right plant, right place",
    body: "Light, wind, salt spray from the road, a neighbour's maple taking all the water. A plant chosen for the spot it's actually in will outlive one chosen from a catalogue photo.",
  },
  {
    title: "Native where it fits",
    body: "Ontario natives and pollinator plants go in wherever they suit the site. They tend to be tougher here, and they feed the bees, birds and butterflies that share the block.",
  },
  {
    title: "Care after planting day",
    body: "A garden isn't finished when the last plant goes in. I come back to water in, edit, divide and adjust, so it settles instead of struggling.",
  },
] as const;

export const services = [
  {
    slug: "design",
    title: "Garden design and planting",
    lede: "From a bare yard or a tired border to a planted, living garden.",
    body: "We walk the space together, I test the soil and watch the light, then I draw up a planting plan that fits how you actually use the garden. I source the plants, prepare the beds and plant everything myself.",
    points: ["Site visit and soil assessment", "Planting plan and plant list", "Bed preparation and planting"],
  },
  {
    slug: "care",
    title: "Seasonal care and maintenance",
    lede: "Regular visits from someone who knows your garden plant by plant.",
    body: "Spring clean-up timed for the insects overwintering in your stems, summer editing and deadheading, fall planting and putting the garden to bed. Visits are booked through the season so nothing gets away from you.",
    points: ["Spring and fall clean-ups", "Pruning, dividing, deadheading", "Weekly, fortnightly or monthly"],
  },
  {
    slug: "containers",
    title: "Balconies, terraces and containers",
    lede: "Real gardens in small, windy, high-up places.",
    body: "Condo balconies and rooftop terraces have their own weather. I choose containers, soil mixes and plants that can take wind, reflected heat and building rules, and show you how to keep them going.",
    points: ["Wind- and heat-tolerant planting", "Containers and soil mixes", "Seasonal changeovers"],
  },
  {
    slug: "native",
    title: "Native and pollinator gardens",
    lede: "Gardens that feed the neighbourhood as well as decorating it.",
    body: "Front-yard meadows, boulevard plantings and shady woodland corners built around Ontario native species. Planned so they look intentional to the neighbours and generous to the wildlife.",
    points: ["Native plants chosen for your site", "Lawn-to-garden conversions", "Habitat-friendly clean-ups"],
  },
  {
    slug: "coaching",
    title: "Garden coaching",
    lede: "Learn to look after your own garden, with me beside you.",
    body: "One-on-one sessions in your own garden. We go through what's there, what it needs and when, and you finish knowing how to prune that shrub, when to divide those hostas and what you can safely ignore.",
    points: ["Hands-on sessions at your place", "A care calendar written for your garden", "Follow-up questions by email"],
  },
] as const;

export const contactSteps = [
  { title: "Send me a note", body: `Tell me a little about your garden using the form, or call. I reply ${site.responseTime}.` },
  { title: "Site visit", body: "I come and walk the garden with you. I check the soil, light and drainage and listen to what you want from the space." },
  { title: "Plan and quote", body: "You get a written plan of what I'd do, when, and what it costs. Take your time with it." },
  { title: "Planting and care", body: "I do the work myself, then come back through the seasons to keep it growing well." },
] as const;

export const principles = [
  {
    title: "One gardener, start to finish",
    body: "The person who visits is the person who plans, plants and tends. Nothing gets lost between a salesperson and a crew.",
  },
  {
    title: "Honest advice",
    body: "If a plant won't thrive where you want it, I'll tell you. If a corner is better left alone, I'll tell you that too.",
  },
  {
    title: "Work with the site",
    body: "Shade, clay, wind and road salt are facts of city gardening. Good design starts from them rather than fighting them.",
  },
  {
    title: "Leave it better",
    body: "Healthier soil, more life, fewer chemicals. Every garden should give a little back to the street it's on.",
  },
] as const;

// PLACEHOLDER - replace with real projects once available.
// To use photos instead of the drawn plans, add `photos: { before: "/work/x-before.jpg", after: "/work/x-after.jpg" }`
// (files in /public/work). The slider shows photos whenever they're present.
export const projects: {
  slug: string;
  title: string;
  place: string;
  type: string;
  year: string;
  brief: string;
  done: string[];
  plan: Plan;
  photos?: { before: string; after: string };
}[] = [
  {
    slug: "leslieville",
    title: "A shady backyard that finally fills in",
    place: "Leslieville",
    type: "Backyard design and planting",
    year: "2025",
    brief:
      "A narrow semi-detached lot under a mature Norway maple. Dry shade, compacted clay, and a lawn that had given up years ago.",
    done: [
      "Lifted the dead lawn and worked leaf compost into the clay",
      "Re-laid the old concrete pad as a small patio",
      "Planted layered shade beds along both fences and under the maple",
      "Set a stepping-stone path through to the back gate",
    ],
    plan: {
      house: { rect: [16, 16, 56, 228], label: "House" },
      trees: [{ x: 300, y: 74, r: 52, label: "Existing maple" }],
      before: [
        { kind: "turf", rect: [72, 16, 312, 228], label: "Patchy lawn" },
        { kind: "paving", rect: [72, 80, 52, 100], label: "Concrete pad" },
      ],
      after: [
        { kind: "mulch", rect: [72, 16, 312, 228] },
        { kind: "paving", rect: [72, 80, 52, 100], label: "Patio" },
        { kind: "bed", points: [[124, 16], [384, 16], [384, 132], [330, 138], [268, 112], [236, 70], [180, 62], [124, 66]] },
        { kind: "bed", points: [[124, 244], [384, 244], [384, 206], [320, 196], [240, 208], [170, 198], [124, 204]] },
      ],
      paths: [{ kind: "stepping", points: [[132, 130], [190, 142], [250, 160], [310, 170], [376, 168]] }],
      drifts: [
        { code: "A", cx: 162, cy: 38, n: 8, spread: 22 },
        { code: "C", cx: 222, cy: 38, n: 5, spread: 18 },
        { code: "B", cx: 300, cy: 100, n: 8, spread: 26 },
        { code: "D", cx: 358, cy: 104, n: 4, spread: 16 },
        { code: "A", cx: 176, cy: 224, n: 7, spread: 18 },
        { code: "D", cx: 258, cy: 226, n: 5, spread: 15 },
        { code: "C", cx: 340, cy: 224, n: 5, spread: 17 },
      ],
      key: [
        { code: "A", latin: "Carex pensylvanica", common: "Pennsylvania sedge", form: "grass", r: 5, tone: "#8FA77B" },
        { code: "B", latin: "Asarum canadense", common: "Wild ginger", form: "mound", r: 5, tone: "#6E8F62" },
        { code: "C", latin: "Polystichum acrostichoides", common: "Christmas fern", form: "fern", r: 8, tone: "#4E7246" },
        { code: "D", latin: "Geranium maculatum", common: "Wild geranium", form: "mound", r: 6, tone: "#B98BB0" },
      ],
    },
  },
  {
    slug: "midtown",
    title: "From lawn to pollinator front yard",
    place: "Midtown",
    type: "Native and pollinator garden",
    year: "2024",
    brief:
      "A full-sun front lawn on a busy street. The owners wanted something alive that the neighbours would still read as a proper garden.",
    done: [
      "Removed the turf and kept the soil in place, no new topsoil trucked in",
      "Planted a structured native meadow either side of the front walk",
      "Wove a stepping-stone path through so it can be tended without trampling",
      "Edged everything cleanly so it looks intended from the sidewalk",
    ],
    plan: {
      house: { rect: [16, 16, 368, 52], label: "House" },
      before: [
        { kind: "turf", rect: [16, 68, 164, 156], label: "Lawn" },
        { kind: "turf", rect: [216, 68, 168, 156], label: "Lawn" },
        { kind: "paving", rect: [180, 68, 36, 156] },
        { kind: "paving", rect: [16, 224, 368, 20], label: "Sidewalk" },
      ],
      after: [
        { kind: "bed", rect: [16, 68, 164, 156] },
        { kind: "bed", rect: [216, 68, 168, 156] },
        { kind: "paving", rect: [180, 68, 36, 156] },
        { kind: "paving", rect: [16, 224, 368, 20], label: "Sidewalk" },
      ],
      paths: [{ kind: "stepping", points: [[226, 150], [270, 142], [320, 156], [376, 150]] }],
      drifts: [
        { code: "E", cx: 58, cy: 108, n: 9, spread: 28 },
        { code: "A", cx: 124, cy: 176, n: 7, spread: 24 },
        { code: "B", cx: 60, cy: 190, n: 5, spread: 20 },
        { code: "C", cx: 136, cy: 100, n: 4, spread: 18 },
        { code: "A", cx: 262, cy: 100, n: 6, spread: 22 },
        { code: "B", cx: 346, cy: 102, n: 5, spread: 22 },
        { code: "D", cx: 248, cy: 196, n: 5, spread: 18 },
        { code: "C", cx: 296, cy: 198, n: 4, spread: 16 },
        { code: "E", cx: 350, cy: 196, n: 7, spread: 22 },
      ],
      key: [
        { code: "A", latin: "Echinacea purpurea", common: "Purple coneflower", form: "mound", r: 6, tone: "#C482A3" },
        { code: "B", latin: "Monarda fistulosa", common: "Wild bergamot", form: "mound", r: 6, tone: "#AE9BC6" },
        { code: "C", latin: "Asclepias tuberosa", common: "Butterfly milkweed", form: "mound", r: 6, tone: "#E0A066" },
        { code: "D", latin: "Rudbeckia hirta", common: "Black-eyed Susan", form: "mound", r: 5, tone: "#E3C25B" },
        { code: "E", latin: "Schizachyrium scoparium", common: "Little bluestem", form: "grass", r: 6, tone: "#9DAE8A" },
      ],
    },
  },
  {
    slug: "liberty-village",
    title: "A windproof condo terrace",
    place: "Liberty Village",
    type: "Terrace and containers",
    year: "2025",
    brief:
      "A 20th-floor terrace with afternoon sun and wind most days. Every nursery plant the owners tried had dried out or blown over.",
    done: [
      "Replaced small pots with heavy, wide planters that stay put in a gust",
      "Mixed a gritty, free-draining container soil",
      "Planted wind-tolerant herbs, grasses and two small serviceberries",
      "Left the middle clear for a table and chairs",
    ],
    plan: {
      house: { rect: [16, 16, 368, 40], label: "Building" },
      before: [{ kind: "paving", rect: [16, 56, 368, 188], label: "Concrete pavers" }],
      after: [
        { kind: "paving", rect: [16, 56, 368, 188] },
        { kind: "deck", rect: [130, 96, 140, 80], label: "Seating" },
        { kind: "planter", rect: [36, 210, 328, 26] },
        { kind: "planter", rect: [28, 68, 52, 52] },
        { kind: "planter", rect: [320, 68, 52, 52] },
      ],
      drifts: [
        { code: "A", cx: 62, cy: 223, n: 3, spread: 10 },
        { code: "E", cx: 120, cy: 223, n: 4, spread: 12 },
        { code: "B", cx: 194, cy: 223, n: 3, spread: 10 },
        { code: "E", cx: 268, cy: 223, n: 4, spread: 12 },
        { code: "C", cx: 336, cy: 223, n: 3, spread: 10 },
        { code: "D", cx: 54, cy: 94, n: 1, spread: 0 },
        { code: "D", cx: 346, cy: 94, n: 1, spread: 0 },
      ],
      key: [
        { code: "A", latin: "Thymus vulgaris", common: "Common thyme", form: "mound", r: 5, tone: "#9DAE8A" },
        { code: "B", latin: "Salvia rosmarinus", common: "Rosemary", form: "grass", r: 6, tone: "#7E9A84" },
        { code: "C", latin: "Sedum ternatum", common: "Woodland stonecrop", form: "mound", r: 5, tone: "#B7C79A" },
        { code: "D", latin: "Amelanchier × grandiflora 'Autumn Brilliance'", common: "Serviceberry", form: "shrub", r: 20, tone: "#6E8F62" },
        { code: "E", latin: "Sporobolus heterolepis", common: "Prairie dropseed", form: "grass", r: 6, tone: "#A9B98F" },
      ],
    },
  },
  {
    slug: "oakville",
    title: "A woodland garden under old oaks",
    place: "Oakville",
    type: "Shade garden and seasonal care",
    year: "2023 to now",
    brief:
      "A large lot shaded by two mature red oaks, where the lawn thinned out a little more every year and needed reseeding every spring.",
    done: [
      "Gave the lawn under the oaks back to the woodland",
      "Planted ferns, sedges and spring ephemerals in broad drifts",
      "Laid a wood-chip path that winds between the trees",
      "Monthly care visits from April to November",
    ],
    plan: {
      house: { rect: [16, 16, 70, 228], label: "House" },
      trees: [
        { x: 222, y: 80, r: 56, label: "Existing oak" },
        { x: 330, y: 190, r: 48, label: "Existing oak" },
      ],
      before: [
        { kind: "turf", rect: [86, 16, 298, 228], label: "Thin lawn" },
        { kind: "paving", rect: [86, 90, 40, 80], label: "Patio" },
      ],
      after: [
        { kind: "mulch", rect: [86, 16, 298, 228] },
        { kind: "paving", rect: [86, 90, 40, 80], label: "Patio" },
        { kind: "bed", points: [[126, 16], [384, 16], [384, 96], [300, 112], [250, 140], [180, 128], [126, 110]] },
        { kind: "bed", points: [[126, 244], [384, 244], [384, 140], [310, 150], [250, 182], [180, 170], [126, 152]] },
      ],
      paths: [{ kind: "chip", points: [[126, 131], [180, 150], [250, 161], [300, 131], [384, 118]] }],
      drifts: [
        { code: "A", cx: 168, cy: 60, n: 6, spread: 22 },
        { code: "B", cx: 256, cy: 104, n: 7, spread: 20 },
        { code: "C", cx: 340, cy: 52, n: 5, spread: 20 },
        { code: "D", cx: 180, cy: 206, n: 6, spread: 20 },
        { code: "E", cx: 252, cy: 216, n: 6, spread: 18 },
        { code: "A", cx: 350, cy: 214, n: 5, spread: 18 },
      ],
      key: [
        { code: "A", latin: "Athyrium filix-femina", common: "Lady fern", form: "fern", r: 8, tone: "#5E7F59" },
        { code: "B", latin: "Tiarella cordifolia", common: "Foamflower", form: "mound", r: 5, tone: "#C9CDB8" },
        { code: "C", latin: "Maianthemum racemosum", common: "False Solomon's seal", form: "mound", r: 7, tone: "#8FA77B" },
        { code: "D", latin: "Aquilegia canadensis", common: "Wild columbine", form: "mound", r: 5, tone: "#D08A6E" },
        { code: "E", latin: "Carex plantaginea", common: "Plantain-leaved sedge", form: "grass", r: 6, tone: "#9DAE8A" },
      ],
    },
  },
];

// PLACEHOLDER - replace with real client quotes before launch (with their permission).
// `project` ties each quote to a project above so it sits next to that work.
export const testimonials = [
  {
    project: "leslieville",
    quote: "Three years on, the garden looks better than the day she planted it. That never happened with the landscapers we used before.",
    name: "Jen", // PLACEHOLDER
    place: "Leslieville",
  },
  {
    project: "midtown",
    quote: "It was the same person every visit. She knew which plants were struggling before I did.",
    name: "Marcus", // PLACEHOLDER
    place: "Midtown",
  },
  {
    project: "liberty-village",
    quote: "Our balcony used to be where nursery plants went to die. Now we cook from it all summer.",
    name: "Aiko", // PLACEHOLDER
    place: "Liberty Village",
  },
  {
    project: "oakville",
    quote: "I've learned more about my own garden from Shannon's visits than from ten years of owning it.",
    name: "Dev", // PLACEHOLDER
    place: "Oakville",
  },
] as const;

// Seasonal tasks for Toronto and the GTA (USDA zone 5b–6a). Months are 0-indexed to match Date.getMonth().
export const monthlyTasks: { month: string; note: string; tasks: { title: string; body: string }[] }[] = [
  {
    month: "January",
    note: "The garden is resting. Plan, protect and keep the salt away.",
    tasks: [
      { title: "Keep road salt off your beds", body: "Shovel snow from salted walks away from planting beds and use sand or grit near the garden instead of salt." },
      { title: "Brush heavy snow off evergreens", body: "Gently push snow up and off cedar and yew branches with a broom so they don't split. Leave ice alone; it breaks more than it bends." },
      { title: "Check stored tubers", body: "Look over dahlia and canna tubers in storage. Discard soft or mouldy ones and lightly mist any that are shrivelling." },
      { title: "Order seeds", body: "Native seed and popular vegetable varieties sell out early. Order now for winter sowing and spring starts." },
    ],
  },
  {
    month: "February",
    note: "Still cold, but the season starts indoors.",
    tasks: [
      { title: "Winter-sow native seeds", body: "Sow milkweed, coneflower and other natives that need cold stratification in containers outside. Freezing and thawing does the work." },
      { title: "Prune fruit trees while dormant", body: "Apples and pears are easiest to shape now, when you can see the branch structure and before buds swell." },
      { title: "Start onions and leeks indoors", body: "Slow growers like onions, leeks and peppers can be started under lights from mid to late February." },
      { title: "Look for rodent damage", body: "Check the base of young trees and shrubs for chewed bark. Wrap trunks with hardware cloth if rabbits or voles have found them." },
    ],
  },
  {
    month: "March",
    note: "Longer days, but the soil is still cold and wet. Patience.",
    tasks: [
      { title: "Cut back ornamental grasses", body: "Cut last year's grasses down to a few centimetres before green shoots appear, so you don't trim the new growth." },
      { title: "Start tomatoes indoors late in the month", body: "Count back six to eight weeks from Toronto's mid-May last frost. Late March is about right for tomatoes." },
      { title: "Stay off wet soil", body: "Walking on or digging saturated soil compacts it for the whole season. If a handful sticks in a ball, wait." },
      { title: "Clean and sharpen tools", body: "Sharpen pruners and spades, and wipe blades with alcohol so you're not spreading disease between plants." },
    ],
  },
  {
    month: "April",
    note: "Clean up slowly. Plenty of insects are still asleep in last year's stems.",
    tasks: [
      { title: "Wait for warmth before clean-up", body: "Hold off on a full clean-up until daytime temperatures are reliably around 10°C. Cut hollow stems to 30–45 cm so native bees can nest in them." },
      { title: "Direct-sow cool-season crops", body: "Peas, spinach, lettuce and radishes can go straight into the ground once the soil can be worked." },
      { title: "Prune roses when the forsythia blooms", body: "That yellow flush around town is your signal. Take out dead, damaged and crossing canes." },
      { title: "Divide late-flowering perennials", body: "Asters, sedums and grasses that bloom in summer and fall can be lifted and split as they start into growth." },
    ],
  },
  {
    month: "May",
    note: "Planting month. Toronto's last frost usually falls around mid-May.",
    tasks: [
      { title: "Plant tender plants after the Victoria Day weekend", body: "Tomatoes, basil and annuals go out once nights stay above 10°C. Harden off seedlings for a week first." },
      { title: "Plant natives and perennials", body: "Soil is warm and rain is reliable. A good month to plant, as long as you water new plants in well." },
      { title: "Watch for red lily leaf beetle", body: "Bright red beetles on lilies and fritillaries are common in the GTA. Hand-pick them into soapy water and check under leaves for larvae." },
      { title: "Mulch once the soil warms", body: "A few centimetres of shredded leaf or bark mulch keeps moisture in and weeds down. Keep it off stems and crowns." },
    ],
  },
  {
    month: "June",
    note: "Everything is growing fast. Stay ahead of it.",
    tasks: [
      { title: "Water deeply, not daily", body: "Aim for about 2.5 cm of water a week, given in one or two long soaks so roots go down rather than staying near the surface." },
      { title: "Pinch back fall bloomers", body: "Cut asters, mums and tall sedums back by a third for bushier plants that don't flop. Stop by early July." },
      { title: "Stake before you need to", body: "Put supports in for peonies, delphiniums and tall perennials now, while they can grow into them." },
      { title: "Weed after rain", body: "Weeds pull out roots and all from damp soil. Ten minutes after a shower beats an hour in a dry spell." },
    ],
  },
  {
    month: "July",
    note: "Heat and humidity. Water early and keep things tidy.",
    tasks: [
      { title: "Water early in the morning", body: "Less evaporation and leaves dry before evening, which helps prevent mildew. Containers may need water every day in a heat wave." },
      { title: "Check boxwood for box tree moth", body: "Box tree moth is established in the GTA. Look for webbing and green-and-black caterpillars inside shrubs and remove them early." },
      { title: "Deadhead for more flowers", body: "Snip spent blooms on annuals, roses and repeat-flowering perennials. Leave coneflower and rudbeckia seed heads later for the birds." },
      { title: "Sow a second round of crops", body: "Late July is time to sow bush beans, carrots, kale and lettuce for a fall harvest." },
    ],
  },
  {
    month: "August",
    note: "Late-summer abundance, and the first thoughts of fall planting.",
    tasks: [
      { title: "Divide bearded iris", body: "Lift crowded clumps, discard old or rotten rhizomes and replant healthy pieces shallowly, tops just showing." },
      { title: "Keep new plantings watered", body: "Anything planted this year still needs regular deep watering through dry spells. Established natives can usually fend for themselves." },
      { title: "Order spring bulbs", body: "Order garlic and spring bulbs now for the best selection, ready to plant from late September." },
      { title: "Collect seed", body: "Save seed from native plants and heirloom vegetables as heads dry. Store in paper envelopes, labelled and dated." },
    ],
  },
  {
    month: "September",
    note: "The best planting month of the year. Warm soil, cooler air.",
    tasks: [
      { title: "Plant trees, shrubs and perennials", body: "Roots keep growing well into fall, giving new plants a head start before next summer's heat." },
      { title: "Divide spring and summer bloomers", body: "Split crowded hostas, daylilies and peonies (if you must move peonies, now is the time)." },
      { title: "Bring houseplants in", body: "Move tropical plants indoors before nights drop below 10°C. Check them for pests first." },
      { title: "Overseed thin lawn", body: "If you're keeping lawn, this is the best time to overseed bare patches, or to plan converting part of it to garden." },
    ],
  },
  {
    month: "October",
    note: "Putting the garden to bed, gently.",
    tasks: [
      { title: "Plant garlic and spring bulbs", body: "Mid-October to early November is garlic time in Toronto. Tulips, daffodils and alliums go in now too." },
      { title: "Lift dahlias after the first frost", body: "Once frost blackens the foliage, dig up dahlias and cannas, let them dry and store them somewhere cool and frost-free." },
      { title: "Leave seed heads standing", body: "Coneflower, rudbeckia and grass seed heads feed birds through winter and look beautiful under frost." },
      { title: "Water evergreens before freeze-up", body: "Give cedars, yews and boxwood a long soak before the ground freezes. Dry evergreens suffer most from winter burn." },
    ],
  },
  {
    month: "November",
    note: "Last jobs before the ground freezes.",
    tasks: [
      { title: "Plant garlic", body: "Early November is still fine in Toronto. Plant cloves pointy end up, about 5 cm deep, and mulch with straw once the ground starts to freeze." },
      { title: "Leave the leaves on your beds", body: "Fallen leaves insulate roots and shelter overwintering insects, including butterfly and moth larvae. Rake them off the lawn and onto the beds." },
      { title: "Wrap young evergreens and boxwood", body: "Burlap screens protect young evergreens and boxwood from road salt spray and drying winter wind. Leave the top open so air can move." },
      { title: "Last chance for spring bulbs", body: "You can plant tulips and daffodils right up until the ground freezes. Late-planted bulbs still flower." },
    ],
  },
  {
    month: "December",
    note: "Rest, protect, and recycle the holidays into the garden.",
    tasks: [
      { title: "Mulch once the ground freezes", body: "Mulching after freeze-up keeps the soil frozen and stops perennials being heaved out by freeze-thaw cycles." },
      { title: "Use evergreen boughs as mulch", body: "Cut branches from your holiday tree and lay them over perennial beds for extra winter protection." },
      { title: "Check burlap and tree guards", body: "Wind and snow loads can knock wraps loose. Re-tie them so they're still doing their job in February." },
      { title: "Shut off outdoor taps", body: "If you haven't already, close the indoor valve, drain the line and bring hoses in so nothing splits." },
    ],
  },
];
