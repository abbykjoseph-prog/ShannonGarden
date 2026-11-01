// All business copy and facts live here so they can be edited in one place.
// Anything marked TODO is a placeholder and needs confirming with Shannon before launch.

export const site = {
  name: "Shannon Boudreau Gardens",
  person: "Shannon Boudreau",
  firstName: "Shannon",
  url: "https://shannonboudreaugardens.vercel.app", // TODO replace with the real domain
  phone: "(416) 555-0142", // TODO confirm
  phoneHref: "tel:+14165550142", // TODO confirm
  email: "hello@example.com", // TODO confirm
  instagram: "", // TODO add handle if wanted, e.g. "shannonboudreaugardens"
  yearsExperience: 15, // TODO confirm
  education: "Diploma in Horticulture, [School name]", // TODO confirm school and credential
  educationShort: "Trained horticulturist", // used in small badges
  responseTime: "within two working days", // TODO confirm
  seasonNote: "Booking spring visits from February; care rounds run April to November.", // TODO confirm
  region: "Greater Toronto Area",
  localSeo: "garden design and care in Toronto and the GTA",
  serviceArea: [
    "Old Toronto",
    "East York",
    "York",
    "North York",
    "Etobicoke",
    "Scarborough",
    "Mississauga",
    "Oakville",
    "Vaughan",
    "Markham",
    "Richmond Hill",
    "Pickering",
  ], // TODO confirm which areas Shannon actually covers
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
] as const;

export const approach = [
  {
    title: "Soil first",
    body: "Before anything goes in the ground I look at what it's going into: texture, drainage, compaction, what the last owner left behind. Most city soil needs feeding, not replacing.",
  },
  {
    title: "Right plant, right place",
    body: "Light, wind, salt spray from the road, a neighbour's maple stealing water. A plant chosen for the spot it's actually in will outlive one chosen from a catalogue photo.",
  },
  {
    title: "Native where it fits",
    body: "Ontario natives and pollinator plants go in wherever they suit the site. Not as a rule, but because they tend to be tougher here and they feed the bees, birds and butterflies that share the block.",
  },
  {
    title: "Care after planting day",
    body: "A garden isn't finished when the last plant goes in. I come back to water in, edit, divide and adjust, so the garden settles instead of struggling.",
  },
] as const;

export const services = [
  {
    slug: "design",
    title: "Garden design and planting",
    lede: "From a bare yard or a tired border to a planted, living garden.",
    body: "We walk the space together, I test the soil and watch the light, then draw up a planting plan that fits how you actually use the garden. I source the plants, prepare the beds and plant everything myself.",
    points: ["Site visit and soil assessment", "Planting plan with a plant list", "Bed preparation and planting"],
  },
  {
    slug: "care",
    title: "Seasonal care and maintenance",
    lede: "Regular visits from someone who knows your garden by name.",
    body: "Spring clean-up done at the right time for overwintering insects, summer editing and deadheading, fall planting and putting the garden to bed. Visits are scheduled through the season so nothing gets away from you.",
    points: ["Spring and fall clean-ups", "Pruning, dividing and deadheading", "Weekly, fortnightly or monthly rounds"],
  },
  {
    slug: "containers",
    title: "Balconies, terraces and containers",
    lede: "Real gardens in small, windy, high-up places.",
    body: "Condo balconies and rooftop terraces have their own weather. I choose containers, soil mixes and plants that can handle wind, reflected heat and building rules, and set you up to keep them going.",
    points: ["Wind- and heat-tolerant planting", "Container and soil selection", "Seasonal changeovers"],
  },
  {
    slug: "native",
    title: "Native and pollinator gardens",
    lede: "Gardens that feed the neighbourhood, not just decorate it.",
    body: "Front-yard meadows, boulevard plantings and shady woodland corners built around Ontario native species. Planned so they look intentional to the neighbours and generous to the wildlife.",
    points: ["Native plant selection for your site", "Lawn-to-garden conversions", "Habitat-friendly fall and spring care"],
  },
  {
    slug: "coaching",
    title: "Garden coaching",
    lede: "Learn to look after your own garden, with someone at your side.",
    body: "One-on-one sessions in your own garden. We work through what's there, what it needs and when, and you leave knowing how to prune that shrub, when to divide those hostas and what to ignore.",
    points: ["Hands-on sessions in your garden", "A seasonal care calendar written for you", "Follow-up questions by email"],
  },
] as const;

export const principles = [
  {
    title: "One gardener, start to finish",
    body: "The person who visits is the person who plans, plants and tends. Nothing gets lost between a salesperson and a crew.",
  },
  {
    title: "Honest advice",
    body: "If a plant won't thrive where you want it, I'll say so. If a corner is better left alone, I'll say that too.",
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

// TODO replace with real projects and photos once available.
export const projects = [
  {
    title: "A shady backyard that finally fills in",
    place: "Leslieville",
    type: "Backyard design and planting",
    year: "2025",
    summary:
      "A narrow semi-detached lot under a mature Norway maple. Dry shade, compacted clay and a lawn that never took. We lifted the turf, worked in leaf compost and planted layers of shade-tolerant perennials and ferns.",
    plants: ["Carex pensylvanica", "Asarum canadense", "Polystichum acrostichoides", "Geranium maculatum"],
    tone: "fern",
  },
  {
    title: "From lawn to pollinator front yard",
    place: "Midtown",
    type: "Native and pollinator garden",
    year: "2024",
    summary:
      "A full-sun front lawn turned into a structured native meadow, edged cleanly so it reads as a garden from the sidewalk. Something flowers from May to October, and the bees noticed in the first summer.",
    plants: ["Echinacea purpurea", "Monarda fistulosa", "Asclepias tuberosa", "Schizachyrium scoparium"],
    tone: "meadow",
  },
  {
    title: "A windproof balcony kitchen garden",
    place: "Liberty Village",
    type: "Balcony and containers",
    year: "2025",
    summary:
      "A 20th-floor balcony with afternoon sun and constant wind. Heavy, wide containers, a gritty mix and compact herbs, tomatoes and trailing plants that hold up in a gust.",
    plants: ["Thymus vulgaris", "Salvia rosmarinus", "Solanum lycopersicum 'Tumbler'", "Sedum spp."],
    tone: "terrace",
  },
  {
    title: "Seasonal care for an old perennial border",
    place: "Roncesvalles",
    type: "Seasonal care and coaching",
    year: "2023 to now",
    summary:
      "A long-established border that had got away from its owners. Two seasons of editing, dividing and replanting, then coaching sessions so they can keep it themselves with a few visits a year.",
    plants: ["Hemerocallis fulva", "Phlox paniculata", "Symphyotrichum novae-angliae", "Hosta spp."],
    tone: "border",
  },
] as const;

// TODO replace with real client quotes (with permission) before launch.
export const testimonials = [
  {
    quote:
      "Shannon explained every choice she made, and three years on the garden looks better than the day she planted it. That never happened with the landscaping companies we used before.",
    name: "Homeowner", // TODO real name or initials
    place: "Leslieville",
  },
  {
    quote:
      "It was the same person every visit. She knew which plants were struggling before I did.",
    name: "Homeowner", // TODO real name or initials
    place: "Midtown",
  },
  {
    quote:
      "Our balcony used to be a graveyard for nursery plants. Now we eat from it all summer.",
    name: "Condo owner", // TODO real name or initials
    place: "Liberty Village",
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
