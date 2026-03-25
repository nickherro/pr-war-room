import { useState, useMemo, useCallback } from "react";

const INITIAL_ENTRIES = [
  // === MEDIA ENTRIES (19) ===
  {
    id: 1,
    date: "2026-03-04",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "DeQuevedo family: 12-year-old with Tourette's and pituitary tumor faces care disruption",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Lead story on March 4 breakdown. Mother describes fear of losing specialists mid-treatment. Most impactful patient story in local TV coverage. Repeated across multiple CBS segments.",
  },
  {
    id: 2,
    date: "2026-03-06",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "Massiel Lugo: lupus patient from Queens, single mom working 3 jobs, may lose Mt Sinai access",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Lugo's story extremely sympathetic — chronic illness, economic hardship, caregiving burden. Cross-posted to TikTok where it went viral. CBS framing clearly favors patient/provider side.",
  },
  {
    id: 3,
    date: "2026-03-08",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "John Esposito of Huntington calls himself a 'health care refugee' after losing Mt Sinai access",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Long Island patient. 'Health care refugee' language is powerful and quotable. Esposito actively seeking new coverage. CBS continues to be most impactful local outlet.",
  },
  {
    id: 4,
    date: "2026-03-10",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "Susan Kim, Upper West Side patient, fears losing oncologist at Mt Sinai",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Fourth CBS patient story. Kim is Upper West Side — affluent demographic that votes, donates, and complains loudly. Cancer care disruption angle is devastating for Anthem.",
  },
  {
    id: 5,
    date: "2026-03-05",
    source: "NBC News",
    sourceType: "tv",
    channel: "media",
    headline: "Natalie Reichel: cancer patient mid-therapy worried about losing Mt Sinai coverage",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "NATIONAL pickup. NBC News is the biggest reach of any single story. Cancer mid-therapy is the most sympathetic possible patient scenario. Anthem has zero equivalent patient advocates in public.",
  },
  {
    id: 6,
    date: "2026-03-07",
    source: "Gothamist / WNYC",
    sourceType: "radio",
    channel: "media",
    headline: "Elisabeth Benjamin of Community Service Society calls for systemic reform of insurer-provider negotiations",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Benjamin is a respected healthcare advocate. Frames dispute as systemic insurer problem, not Mt Sinai-specific. Calls for standardized contracting calendar. Gothamist audience is politically engaged NYC.",
  },
  {
    id: 7,
    date: "2026-03-05",
    source: "PIX11",
    sourceType: "tv",
    channel: "media",
    headline: "Mt Sinai and Anthem fail to reach deal — what patients need to know",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Most balanced local TV coverage. Both sides quoted at comparable length. Patient-focused FAQ format. Does not clearly favor either party's framing.",
  },
  {
    id: 8,
    date: "2026-03-09",
    source: "News 12 Long Island",
    sourceType: "tv",
    channel: "media",
    headline: "Fischman family in Valley Stream fears losing Mt Sinai specialists",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Suburban Long Island angle. Nicole & James Fischman — family with kids needing specialists. Suburban patient stories expand the geographic impact narrative beyond Manhattan.",
  },
  {
    id: 9,
    date: "2026-03-12",
    source: "Healthcare Dive",
    sourceType: "news",
    channel: "media",
    headline: "Mt Sinai-Anthem breakdown highlights growing trend of provider-insurer disputes",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Trade press. Contextualizes within national trend of hospital-insurer breakdowns. Notes 18% of hospitals had public disputes 2021-2025. Balanced but the systemic framing implicitly normalizes Mt Sinai's position.",
  },
  {
    id: 10,
    date: "2026-03-11",
    source: "MedCity News",
    sourceType: "news",
    channel: "media",
    headline: "NYC's Mt Sinai goes fully out of network with Anthem BCBS",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Trade press. Factual reporting on the breakdown. Quotes both sides' claims. Notes 200K patients affected. Provides financial context on Elevance's $5.7B profit.",
  },
  {
    id: 11,
    date: "2026-03-13",
    source: "Becker's Hospital Review",
    sourceType: "news",
    channel: "media",
    headline: "Mt Sinai says Anthem owes $450M in unpaid claims",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Trade press leads with Mt Sinai's $450M claim — the stickiest message in the dispute. Anthem's counter (95.4% paid within 15 days) buried lower. Hospital executive audience.",
  },
  {
    id: 12,
    date: "2026-03-14",
    source: "HR Brew",
    sourceType: "news",
    channel: "media",
    headline: "What NYC employers need to know about the Mt Sinai-Anthem split",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Employer/HR angle. Critical channel — employers choosing health plans are Anthem's real customers. If HR professionals start questioning Anthem network adequacy, that's a business risk for Anthem.",
  },
  {
    id: 13,
    date: "2026-03-15",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "32BJ SEIU bypasses Anthem with direct Mt Sinai contract for 100K+ workers",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "DEVASTATING for Anthem. A major union bypassing Anthem entirely validates Mt Sinai's pricing and positions Anthem as the unnecessary middleman. Crain's audience is NYC business decision-makers. Most significant stakeholder story.",
  },
  {
    id: 14,
    date: "2026-03-04",
    source: "keepmountsinai.org",
    sourceType: "owned",
    channel: "media",
    headline: "Mt Sinai launches dedicated campaign site with patient call-to-action",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Owned media but highly effective. Directs patients to: call Anthem, contact HR dept, file DFS complaints. Organized grassroots mobilization. Anthem has nothing equivalent.",
  },
  {
    id: 15,
    date: "2026-03-06",
    source: "choosemountsinai.org / The Vitals podcast",
    sourceType: "owned",
    channel: "media",
    headline: "34-minute podcast episode + choosemountsinai.org enrollment guide + Setting the Record Straight PDF",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Multi-channel owned media blitz: dedicated podcast, second campaign website, formal PDF rebuttal of Anthem's claims. Also partnered with Chapter.org for Medicare enrollment assistance. Sophisticated PR operation.",
  },
  {
    id: 16,
    date: "2026-03-04",
    source: "anthem.com/update/mountsinai",
    sourceType: "owned",
    channel: "media",
    headline: "Anthem FAQ page: 'What you need to know about Mt Sinai'",
    frameAdoption: "anthem",
    sentiment: "negative_mtsinai",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Anthem's primary response — a single FAQ page. Claims Mt Sinai wants 50%+ increase and to eliminate billing checks. Vastly outmatched by Mt Sinai's multi-platform PR operation.",
  },
  {
    id: 17,
    date: "2026-03-05",
    source: "anthem.com — Myths vs Facts",
    sourceType: "owned",
    channel: "media",
    headline: "Anthem publishes Myths vs Facts page countering Mt Sinai claims",
    frameAdoption: "anthem",
    sentiment: "negative_mtsinai",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "low",
    notes: "Claims Mt Sinai refused a ready contract, wants to block claim reviews, and demands rates far above peer systems. Defensive tone. No patient voices. 'Myths vs Facts' format feels corporate.",
  },
  {
    id: 18,
    date: "2026-03-13",
    source: "Becker's Payer Issues",
    sourceType: "news",
    channel: "media",
    headline: "Anthem BCBS responds to Mt Sinai's $450M unpaid claims allegation",
    frameAdoption: "anthem",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Rare Anthem-favorable trade coverage. Anthem says 95.4% of claims paid within 15 days, Mt Sinai has not provided documentation for $450M figure. Payer-focused trade audience more receptive to Anthem's framing.",
  },
  {
    id: 19,
    date: "2026-03-18",
    source: "NY Post",
    sourceType: "news",
    channel: "media",
    headline: "Mt Sinai patients scramble as Anthem network access vanishes",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Post readership skews populist — anti-corporate framing resonates. Includes patient quotes about scrambling for new providers. $5.7B Elevance profit mentioned prominently.",
  },
  // === SOCIAL ENTRIES (19) ===
  {
    id: 20,
    date: "2026-03-05",
    source: "TikTok (@massiellugo)",
    sourceType: "social",
    channel: "social",
    headline: "Massiel Lugo viral TikTok: lupus patient, Queens, single mom, 3 jobs — may lose Mt Sinai",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Most impactful social post. Lugo's personal story — lupus, single mom, 3 jobs, Queens — is maximally sympathetic. Viral engagement. Cross-covered by CBS. TikTok audience skews young and shares aggressively.",
  },
  {
    id: 21,
    date: "2026-03-04",
    source: "YouTube / CBS share",
    sourceType: "social",
    channel: "social",
    headline: "DeQuevedo family CBS story shared widely on YouTube and Facebook",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "CBS segment reshared across platforms. Comment sections overwhelmingly sympathetic to family. 12-year-old with Tourette's and pituitary tumor — audience naturally sides with child patient.",
  },
  {
    id: 22,
    date: "2026-03-06",
    source: "CBS News comment section",
    sourceType: "social",
    channel: "social",
    headline: "CBS comment sections overwhelmingly anti-Anthem",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Dominant themes: 'Anthem is greedy,' 'insurance companies don't care about patients,' references to Elevance profit. Almost no pro-Anthem comments visible. Post-UHC CEO shooting sentiment amplifies anti-insurer feeling.",
  },
  {
    id: 23,
    date: "2026-03-07",
    source: "Gothamist comment section",
    sourceType: "social",
    channel: "social",
    headline: "Gothamist readers discuss systemic insurer-provider power dynamics",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "More policy-literate commentary. Readers connect dispute to broader insurance industry critique. Elisabeth Benjamin interview drives sophisticated anti-insurer framing in comments.",
  },
  {
    id: 24,
    date: "2026-03-05",
    source: "PIX11 comment section",
    sourceType: "social",
    channel: "social",
    headline: "PIX11 comment section: mixed but majority blames Anthem",
    frameAdoption: "balanced",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "low",
    notes: "More balanced than CBS comments. Some 'both sides' takes. But majority sentiment still anti-Anthem. A few comments note Mt Sinai also dropped Molina — rare counter-narrative in social.",
  },
  {
    id: 25,
    date: "2026-03-06",
    source: "Yahoo News comment section",
    sourceType: "social",
    channel: "social",
    headline: "Yahoo News syndication comments: national audience weighs in",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Yahoo syndication extends reach to national audience. Comments strongly anti-insurer. 'This is why we need Medicare for All' — dispute becomes vehicle for broader healthcare reform advocacy.",
  },
  {
    id: 26,
    date: "2026-03-04",
    source: "Mt Sinai official (Facebook)",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai launches coordinated social campaign across Facebook",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Coordinated campaign: patient testimonials, infographics on $450M owed, call-to-action to pressure Anthem. Professional production quality. Facebook audience skews older — key Anthem enrollment demographic.",
  },
  {
    id: 27,
    date: "2026-03-04",
    source: "Mt Sinai official (Instagram)",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai Instagram campaign: visual storytelling on patient impact",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Instagram Stories and posts featuring patient quotes and provider testimonials. Visual format effective for emotional engagement. Part of coordinated cross-platform campaign.",
  },
  {
    id: 28,
    date: "2026-03-04",
    source: "Mt Sinai official (X/Twitter)",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai X campaign: threading key data points and patient stories",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "X threads with key talking points: $450M owed, 35% underpayment, single-digit increases. Journalist and policy community engagement. Provides shareable data for media covering the story.",
  },
  {
    id: 29,
    date: "2026-03-04",
    source: "Mt Sinai official (LinkedIn)",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai LinkedIn posts target employer and HR professional audience",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "LinkedIn audience = employers, HR professionals, healthcare executives. Strategic channel — employers choose health plans. Framing: 'your employees deserve Mt Sinai access, Anthem is blocking it.'",
  },
  {
    id: 30,
    date: "2026-03-10",
    source: "LinkedIn (Leslie Schlachter, PA-C)",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai PA-C posts personal account of patient care disruption",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Clinician voice adds credibility. Schlachter describes patients crying in her office about losing access. Provider-as-witness framing. Other Mt Sinai clinicians reposting and adding their own stories.",
  },
  {
    id: 31,
    date: "2026-03-05",
    source: "keepmountsinai.org (social share)",
    sourceType: "social",
    channel: "social",
    headline: "Organized call-to-action: call Anthem, contact HR, file DFS complaints",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "CRITICAL asymmetry: Mt Sinai has organized patient pressure campaigns with specific action items. Anthem has no equivalent grassroots mobilization. Patients are calling Anthem AND filing regulatory complaints. This is the game-changer.",
  },
  {
    id: 32,
    date: "2026-03-12",
    source: "Medicare patient forum",
    sourceType: "social",
    channel: "social",
    headline: "Medicare patients confused about whether they're affected by Mt Sinai-Anthem dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Data gap signal: Medicare patients (not directly affected) are confused and worried. Demonstrates how the dispute creates ambient anxiety beyond the directly affected 200K. Mt Sinai's Chapter.org partnership addresses this.",
  },
  {
    id: 33,
    date: "2026-03-14",
    source: "HR professional community (LinkedIn/forums)",
    sourceType: "social",
    channel: "social",
    headline: "HR professionals discuss network adequacy concerns with Anthem plans",
    frameAdoption: "balanced",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Employer channel is where this dispute becomes an Anthem business risk. HR professionals discussing whether to offer Anthem plans if Mt Sinai isn't in-network. Cost framing ('50% increase') has some traction here.",
  },
  {
    id: 34,
    date: "2026-03-08",
    source: "Reddit r/nyc",
    sourceType: "social",
    channel: "social",
    headline: "Reddit r/nyc thread on Mt Sinai-Anthem dispute — limited but anti-Anthem",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "low",
    notes: "Limited visibility via web search. Estimated anti-Anthem based on Reddit's general anti-corporate lean and post-UHC shooting sentiment. DATA GAP: need direct Reddit monitoring for full picture.",
  },
  {
    id: 35,
    date: "2026-03-06",
    source: "Social media (patient switching intent)",
    sourceType: "social",
    channel: "social",
    headline: "Patients posting about switching away from Anthem to keep Mt Sinai access",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "CRITICAL SIGNAL: direction of switching intent is overwhelmingly 'leave Anthem to keep Mt Sinai,' not 'leave Mt Sinai to keep Anthem.' This is the strongest indicator of who patients value more.",
  },
  {
    id: 36,
    date: "2026-03-20",
    source: "Facebook groups (NYC healthcare)",
    sourceType: "social",
    channel: "social",
    headline: "Facebook group discussions: parents worried about pediatric specialist access",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "low",
    notes: "DATA GAP: web search has minimal reach into Facebook groups. Estimated from fragments. Pediatric angle is powerful — parents of sick children are the most vocal advocacy group.",
  },
  {
    id: 37,
    date: "2026-03-15",
    source: "Social media (anti-insurer meta-narrative)",
    sourceType: "social",
    channel: "social",
    headline: "Post-UHC CEO shooting: Mt Sinai dispute fuels broader anti-insurer sentiment",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "The UHC CEO shooting (Dec 2024) created a persistent anti-insurer undercurrent. Mt Sinai's dispute lands in this environment — every Anthem defense is read through a 'greedy insurer' lens. Structural advantage for Mt Sinai.",
  },
  {
    id: 38,
    date: "2026-03-10",
    source: "Mt Sinai employee social posts",
    sourceType: "social",
    channel: "social",
    headline: "Mt Sinai employees sharing personal stories of patient impact on social media",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Nurses, PAs, social workers posting about patient distress. Organic-feeling but clearly encouraged by Mt Sinai comms. Employee voices add authenticity that corporate messaging lacks.",
  },
  // === STAKEHOLDER ENTRIES (12) ===
  {
    id: 39,
    date: "2026-03-15",
    source: "32BJ SEIU",
    sourceType: "news",
    channel: "stakeholder",
    headline: "32BJ SEIU bypasses Anthem with direct Mt Sinai contract for 100K+ workers",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "MOST SIGNIFICANT STAKEHOLDER MOVE. A major union bypassing Anthem entirely says: (1) Mt Sinai's pricing is reasonable, (2) Anthem is the unnecessary middleman. If other unions/employers follow, Anthem's intermediary position erodes. Covered by Crain's.",
  },
  {
    id: 40,
    date: "2026-03-10",
    source: "Gov. Kathy Hochul",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Hochul proposes extending cooling-off period from 60 to 120 days — but has NOT weighed in on this dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "CRITICAL SILENCE. Hochul's 120-day proposal is in the budget but she has not publicly pressured either side in this specific dispute. Previously forced Anthem to reverse anesthesia coverage policy — so she's willing to act on insurers. Her silence suggests no political upside in intervening yet.",
  },
  {
    id: 41,
    date: "2026-03-07",
    source: "Elisabeth Benjamin / Community Service Society",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Benjamin calls for standardized contracting calendar and systemic reform",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Respected consumer advocate. Frames dispute as symptom of broken system where insurers hold too much power. Calls for regulatory reform. Her voice carries weight with legislators and media.",
  },
  {
    id: 42,
    date: "2026-03-12",
    source: "Jason Buxbaum / Brown University",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Academic: 18% of hospitals had public insurer disputes 2021-2025",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Contextualizes Mt Sinai-Anthem within national trend. 18% figure normalizes the dispute — Mt Sinai is not an outlier. Academic credibility. Neutral framing but implicitly challenges Anthem's 'Mt Sinai is uniquely unreasonable' narrative.",
  },
  {
    id: 43,
    date: "2026-03-12",
    source: "Caroline Pearson / Peterson Health Technology Institute",
    sourceType: "opinion",
    channel: "stakeholder",
    headline: "Analyst: provider consolidation gives hospitals leverage in negotiations",
    frameAdoption: "anthem",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Anthem-favorable expert framing. Pearson argues hospital consolidation (Mt Sinai's 7 hospitals) creates market power that drives up costs. This is Anthem's strongest intellectual argument — but it's abstract vs. patient stories.",
  },
  {
    id: 44,
    date: "2026-03-06",
    source: "UN Health & Life Insurance Section",
    sourceType: "news",
    channel: "stakeholder",
    headline: "UN notifies international staff about Mt Sinai network disruption",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Unusual stakeholder — international organization affected. Signals the breadth of the disruption beyond typical NYC residents. Low direct impact but notable for demonstrating reach.",
  },
  {
    id: 45,
    date: "2026-03-04",
    source: "Hotel Trades Council",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Hotel Trades Council retains in-network Mt Sinai access via separate contract",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Like 32BJ, has a separate arrangement. But unlike 32BJ, didn't make a public statement positioning against Anthem. Neutral signal.",
  },
  {
    id: 46,
    date: "2026-01-01",
    source: "Molina Healthcare / Mt Sinai",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Mt Sinai ALSO dropped Molina Medicaid/HARP/Child Health Plus plans for 2026",
    frameAdoption: "anthem",
    sentiment: "negative_mtsinai",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "MT SINAI'S BIGGEST VULNERABILITY. Dropping Molina means low-income patients on Medicaid lost Mt Sinai access. Undermines 'patient champion' narrative. If this gets more coverage, it's devastating for Mt Sinai. Anthem should be amplifying this.",
  },
  {
    id: 47,
    date: "2026-03-25",
    source: "NYC hospital competitors",
    sourceType: "news",
    channel: "stakeholder",
    headline: "NYU Langone, NewYork-Presbyterian, Northwell, Columbia — all SILENT on dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "SILENCE IS DATA. Every major NYC competitor remains in Anthem's network and has not commented. Anthem's 'every other system works with us' is factually true. But competitors also benefit from Mt Sinai losing Anthem patients — no incentive to help either side.",
  },
  {
    id: 48,
    date: "2026-03-18",
    source: "Anthem physician direct-contracting",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Some Mt Sinai-affiliated physicians contract directly with Anthem, breaking ranks",
    frameAdoption: "anthem",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Divide and conquer strategy. Anthem is recruiting individual Mt Sinai physicians to contract directly. Weakens Mt Sinai's unified front. Number unknown — Anthem lists some on their site. Watch for acceleration.",
  },
  {
    id: 49,
    date: "2026-03-20",
    source: "NY State DFS (silence)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "NY Dept of Financial Services has not intervened or made public statement",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "Regulatory silence. Mt Sinai is directing patients to file DFS complaints — if complaint volume spikes, it could trigger state intervention. Key metric to watch. No public pressure on Anthem yet.",
  },
  {
    id: 50,
    date: "2026-03-22",
    source: "UHC/Oxford precedent (2024)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Mt Sinai dropped UnitedHealthcare/Oxford plans in 2024 — pattern of aggressive negotiation",
    frameAdoption: "anthem",
    sentiment: "negative_mtsinai",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Anthem's second-strongest card. Mt Sinai has a PATTERN of dropping major insurers — UHC/Oxford in 2024, Anthem in 2026, Molina in 2026. Weakens 'Anthem is uniquely unreasonable' argument. Trade press and employer audiences receptive to this framing.",
  },
  {
    id: 51,
    date: "2026-02-10",
    source: "NBC News (national)",
    sourceType: "tv",
    channel: "media",
    headline: "Hospitals and insurers are fighting over money, leaving patients in the lurch — Natalie Reichel featured",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "NATIONAL NBC NEWS PICKUP. Natalie Reichel (40, breast cancer survivor, diagnosed at 33) due for cancer therapy in March. Providers gave her 3-month injection early because they feared delays. Quote: 'I am feeling dubious.' Also covers Duke/BCBS-TX, Memorial Hermann/Aetna disputes. Jason Buxbaum (Brown): 1 in 5 hospitals had public disputes 2021-2025. Leemore Dafny (Harvard Kennedy): 'Hospital prices have grown tremendously.' National framing positions disputes as systemic — but patient stories all favor providers.",
  },
  {
    id: 52,
    date: "2026-02-06",
    source: "New York Today (nationaltoday.com)",
    sourceType: "news",
    channel: "media",
    headline: "Thousands Face Disruption as Mount Sinai and Anthem Blue Cross Blue Shield Contract Dispute Continues",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "February coverage of ongoing dispute before hospital exit. Both sides' claims presented. Notes 200K patients affected. Factual tone.",
  },
  {
    id: 53,
    date: "2026-03-02",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "Mount Sinai, Anthem extend deadline to March 3 — John Esposito: 'hopeful but anxious'",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Brief extension from March 1 to March 3 only. John Esposito (Huntington) at risk of losing primary care doctor of 15 years. Does NOT qualify for continuity of care. Quote: 'I consider him my partner in keeping me healthy.' 'I feel hopeful, but anxious.' Extension described as minimal — 2 days.",
  },
  {
    id: 54,
    date: "2026-01-09",
    source: "LI Herald (liherald.com)",
    sourceType: "news",
    channel: "media",
    headline: "Amy Potter of Long Beach: husband Van survived cardiac arrest at Mt Sinai South Nassau days before contract expired",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "NEW PATIENT STORY. Van Potter — cardiac arrest Dec 22, ICU at Mt Sinai South Nassau, discharged Dec 31 — ONE DAY before contract expired. Amy: 'When my husband was in critical condition in the ICU, the last thing I was thinking about was whether our insurance would cover the cost.' Anthem's cost examples cited: $10,500 more for childbirth, $52K for open-heart surgery, $8,500 for knee replacement. James Donnelly (Pulse Center for Patient Safety) quoted.",
  },
  {
    id: 55,
    date: "2026-03-08",
    source: "El Diario NY",
    sourceType: "news",
    channel: "media",
    headline: "Crece la tensión entre Anthem Blue Cross Blue Shield y Mount Sinai por desacuerdos financieros",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "SPANISH-LANGUAGE coverage. Critical for reaching NYC's large Hispanic/Latino Anthem members. Mt Sinai's patient base includes significant Spanish-speaking populations in East Harlem, Queens, Brooklyn. Expands narrative reach beyond English-language media.",
  },
  {
    id: 56,
    date: "2026-03-04",
    source: "NYC Today (nationaltoday.com)",
    sourceType: "news",
    channel: "media",
    headline: "Thousands of New Yorkers Lose In-Network Care in Mount Sinai-Anthem Dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "March 4 coverage of hospital exit. Both sides quoted. Anthem: 'We cannot agree to changes that would drastically increase costs for New Yorkers.' Mt Sinai: Anthem 'refused to commit to contract provisions designed to protect patients.'",
  },
  {
    id: 57,
    date: "2026-01-09",
    source: "Writers Guild of America East (WGAE)",
    sourceType: "news",
    channel: "stakeholder",
    headline: "Writers Guild monitoring Mt Sinai-Anthem dispute, Health Plan staff in regular contact with Anthem",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "low",
    notes: "NEW STAKEHOLDER. WGAE Health Plan actively monitoring. 'Hopeful that the parties will come to a quick resolution that causes minimal disruption for plan participants.' Also launched Lantern (no-cost surgical procedures) and Hinge Health as alternative access points — signals employers preparing contingencies.",
  },
  {
    id: 58,
    date: "2026-01-01",
    source: "NY State Dept of Civil Service",
    sourceType: "news",
    channel: "stakeholder",
    headline: "NY State issues FAQ to state employees about Mt Sinai-Anthem disruption — but state workers retain special access",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "IMPORTANT: NY state employees and Hotel Trades Council members RETAIN in-network access to Mt Sinai physicians even after network exit. This means the disruption is concentrated on commercial/employer Anthem members. State's own employees are shielded — reduces political pressure on Hochul to intervene.",
  },
  {
    id: 59,
    date: "2026-03-04",
    source: "News 12 Long Island (Facebook)",
    sourceType: "social",
    channel: "social",
    headline: "News 12 LI Facebook post on Mt Sinai exit generates high engagement from Long Island patients",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Facebook post: 'JUST IN: Mount Sinai to exit Anthem insurance network forcing many Long Islanders to find new doctors.' Comment section overwhelmingly anti-Anthem. Suburban Long Island audience — key Anthem enrollment territory. Mt Sinai South Nassau in Oceanside is the only major hospital for south shore LI communities.",
  },
  {
    id: 60,
    date: "2026-03-01",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "Mount Sinai leaves Anthem's insurance network — Crain's notes $300M owed for hospital services",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Crain's reports Mt Sinai 'is attempting to recoup $300 million in payments for hospital services it has already provided, but Anthem has not paid.' Note: lower figure than Mt Sinai's $450M total claim. Crain's audience is NYC business/finance decision-makers. Employer-facing outlet.",
  },
  {
    id: 61,
    date: "2026-03-05",
    source: "MedCity News",
    sourceType: "news",
    channel: "media",
    headline: "Mount Sinai Drops Anthem — Navin Nagiah (Daffodil Health): payers face 'pressure on multiple fronts'",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Trade coverage. Elevance $197.6B revenue, $5.7B profit prominently cited. Navin Nagiah quote: 'contract standoffs won't solve underlying cost problems without deeper cost-control innovation.' Expert framing positions dispute as systemic rather than one-sided — but the profit figure is devastating for Anthem optics.",
  },
  {
    id: 62,
    date: "2026-03-25",
    source: "NewYork-Presbyterian / UnitedHealthcare parallel",
    sourceType: "news",
    channel: "stakeholder",
    headline: "NYP also in contract dispute with UnitedHealthcare — April 1 deadline for commercial/Medicare Advantage",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "CRITICAL CONTEXT: NYC's OTHER top hospital system is ALSO fighting a major insurer. NYP/UHC commercial coverage may end April 1, 2026. Medicare Advantage already excluded Jan 1. This NORMALIZES Mt Sinai's position — it's not just Mt Sinai being 'difficult,' it's a systemic pattern. Undermines Anthem's 'every other system works with us' talking point since NYP can't work with UHC either.",
  },
  {
    id: 63,
    date: "2026-01-09",
    source: "HR Brew",
    sourceType: "news",
    channel: "media",
    headline: "HR Brew: employers 'willing to trade choice of network providers for better pricing' — Edward Kaplan, Segal",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "KEY EMPLOYER ANGLE. Edward Kaplan (Segal consulting): 'We're back in the cycle of clients willing to trade choice of network providers for better pricing.' Also: 18% of US hospitals fought insurers 2021-2025, 8% went out-of-network. NY guarantees 90-day continuation for serious conditions. Employer audience weighing network adequacy vs cost — this is where Anthem's business risk lives.",
  },
  {
    id: 64,
    date: "2026-03-04",
    source: "Mount Sinai newsroom",
    sourceType: "owned",
    channel: "media",
    headline: "Mt Sinai podcast: 'What Happens When Insurance Coverage Breaks Down' — 34-min episode explaining dispute",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "34-minute podcast episode on The Vitals. Also syndicated to Yahoo Finance. Professional production. Explains dispute from Mt Sinai perspective. Part of multi-channel owned media strategy that Anthem has no equivalent to.",
  },
  {
    id: 65,
    date: "2025-12-01",
    source: "Northwell Health / 32BJ",
    sourceType: "news",
    channel: "stakeholder",
    headline: "32BJ also has direct contract with Northwell — projected $46M annual savings (20% reduction vs standard rates)",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "CONTEXT for 32BJ-Mt Sinai deal. 32BJ's Northwell direct contract (Dec 2025) saves $46M/year — 20% reduction. Mt Sinai is the SECOND direct contract. Pattern: major union systematically bypassing insurers. If this model scales, it threatens Anthem's intermediary business model fundamentally. Claire Brockbank (32BJ): 'counterproductive to everything we stand for' that patients get caught in insurer-provider crossfire.",
  },
  {
    id: 66,
    date: "2026-03-09",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "32BJ Health Fund inks direct contract with Mt Sinai — healthcare spending growth capped at 3-4%",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Detailed Crain's coverage of 32BJ deal. 100K workers, 6 hospitals, 400 outpatient facilities. Growth capped at 3-4%. Brent Estes (Mt Sinai): deal 'opens doors not available under the typical contract' — simplifies collaboration, reduces admin overhead. Union plans more comprehensive direct contracting within 6 months. DEVASTATING for Anthem's intermediary value proposition.",
  },
  // === NEW ENTRIES: Web-Researched Round 2 ===
  {
    id: 67,
    date: "2026-02-06",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "CBS deep dive on DeQuevedo family — Callum's deep brain stimulation surgery, Chad's pituitary tumor recurrence",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Jenna DeAngelis report, pre-March breakdown. Callum (20) had 7 months of violent tics before Tourette's diagnosis — 30+ doctors. Deep brain stimulation surgery 2022. Father Chad had pituitary tumor surgery Oct 2025, tumor recurred. Family sees 10 Mt Sinai doctors total. Covered by Highmark (PA-based BCBS), not Anthem directly. After CBS inquiry, Highmark approved 90-day continuity of care for both. Key detail: Mt Sinai says Anthem 'withdrew all offers around Thanksgiving' with minimal subsequent contact.",
  },
  {
    id: 68,
    date: "2026-02-10",
    source: "NBC News",
    sourceType: "news",
    channel: "media",
    headline: "NBC national: 'Hospitals and insurers are fighting over money, leaving patients in the lurch'",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Berkeley Lovelace Jr. National pickup featuring Natalie Reichel (40, breast cancer at 33, in remission 6 years, needs hormone-suppressing shots). Spouse Red Faolan worries about recurrence. Brent Estes (Mt Sinai lead negotiator): 'We feel like we're substantially lower in payment rates than our academic peers.' Leemore Dafny (Harvard Kennedy School): 'Hospital prices have grown tremendously.' Jason Buxbaum (Brown): ~500-600 public disputes annually, 18% of hospitals affected. Also mentions UHC/NYP, UHC/Memorial Sloan Kettering (resolved July 1), Memorial Hermann/BCBS TX, Duke/Aetna disputes. Hospital expenses grew 5.1% in 2024 vs 2.9% inflation. Major national exposure.",
  },
  {
    id: 69,
    date: "2026-03-05",
    source: "Gothamist/WNYC",
    sourceType: "news",
    channel: "media",
    headline: "Gothamist: 'It's always about money' — Elisabeth Benjamin on systemic insurer-provider power dynamics",
    frameAdoption: "balanced",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Elisabeth Benjamin (VP Health Initiatives, Community Service Society) interview with WNYC All Things Considered host Sean Carlson. Benjamin frames dispute as systemic, not specific to Mt Sinai. Notes NYC's four major hospital systems charge 400-600% of Medicare rates. New York has second-highest healthcare insurance spending nationally. Calls for standardized contracting calendar: 'All disputes resolved by October; networks established before October 1st.' More balanced than most coverage but still positions patients as casualties of insurer practices.",
  },
  {
    id: 70,
    date: "2026-01-01",
    source: "News 12 Long Island",
    sourceType: "tv",
    channel: "media",
    headline: "News 12: Fischman family of Valley Stream — 'It's not like changing your favorite cereal'",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Kevin Vesey report on Jan 1 contract expiration. Nicole Fischman: 'To see that there was no agreement reached was really disappointing.' James Fischman: 'It's not like you're going to a store and changing your favorite cereal.' Mt Sinai statement: 'We cannot—and will not—subsidize a for-profit insurer's margins.' James Donnelly (Pulse Center for Patient Safety): out-of-pocket costs 'definitely going to be greater.' Continuity of care 'only good for 90 days.' Notes South Nassau in Oceanside affected.",
  },
  {
    id: 71,
    date: "2026-03-04",
    source: "News 12 Long Island",
    sourceType: "tv",
    channel: "media",
    headline: "News 12 LI: Mount Sinai and Anthem to part ways after failed contract negotiations",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Follow-up to Jan 1 coverage. Confirms full hospital exit. References state law 60-day cooling-off period. LI-focused coverage emphasizes South Nassau and suburban patient impact. Also cross-posted to News 12 Bronx.",
  },
  {
    id: 72,
    date: "2025-12-18",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "Crain's: Mount Sinai may leave Anthem's network — earliest major coverage of impending breakdown",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Earliest Crain's coverage. Brent Estes (chief managed care officer) and Kersha Cartwright (Elevance spokeswoman) quoted. Key early claims: $300M in unpaid claims (later revised to $450M). Anthem claims $1B annual cost impact on state healthcare spending. 33,000 patients identified for delayed coverage (pregnant women, cancer patients, surgery candidates). Nearly a year of negotiations. 'Unlikely' deal by Dec 31. Sets up narrative frame that persists.",
  },
  {
    id: 73,
    date: "2026-03-04",
    source: "Healthcare Dive",
    sourceType: "news",
    channel: "media",
    headline: "Healthcare Dive: Mount Sinai, Anthem fail to reach new contract — trade press confirms full split",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Trade publication coverage. Factual reporting of contract failure. Notes Molina Medicaid also dropped — explicitly connects both exits. Both sides' competing claims presented. Key audience: healthcare executives and policy professionals who track payer-provider dynamics nationally.",
  },
  {
    id: 74,
    date: "2025-12-17",
    source: "American Hospital Association",
    sourceType: "other",
    channel: "stakeholder",
    headline: "AHA urges Elevance Health to rescind Anthem's Nonparticipating Provider Policy — broader national battle",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "AHA letter to Gail Boudreaux (Elevance CEO) Dec 17, 2025. Policy effective Jan 1, 2026: penalizes in-network hospitals 10% of claims if any out-of-network provider involved in patient care. Can terminate hospitals from networks. Applies in CO, CT, GA, IN, KY, ME, MO, NV, NH, OH, WI — NOT NY yet but expanding to CA June 1. Federation of American Hospitals also wrote separately. Rural/critical-access/safety-net hospitals exempted. Broader context for Anthem's aggressive posture nationally.",
  },
  {
    id: 75,
    date: "2026-01-09",
    source: "LI Herald",
    sourceType: "news",
    channel: "media",
    headline: "LI Herald: Amy Potter of Long Beach — husband Van survived cardiac arrest at Mt Sinai South Nassau days before contract expired",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Abigail Grieco report. Van Potter admitted to Mt Sinai South Nassau ICU Dec 22, discharged Dec 31 — contract expiration day. Amy: care was 'exceptional and lifesaving.' Now uncertain about follow-up care with same physicians. Mt Sinai's specific cost claims: $10,500 more for childbirth, $52,000 more for open-heart surgery, $8,500 more for knee replacements at out-of-network rates (Anthem disputes). Medicaid enrollees can switch plans within 90 days; Essential Plan members anytime.",
  },
  {
    id: 76,
    date: "2026-03-08",
    source: "El Diario NY",
    sourceType: "news",
    channel: "media",
    headline: "El Diario: Crece la tensión — Spanish-language coverage reaching NYC's Latino community",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Marlyn Montilla report. Critical Spanish-language coverage. Features woman with chronic blood disorder — all specialists at Mt Sinai. 'Three months, what does it give her? Nothing.' Elisabeth Benjamin quoted: NYC hospitals charge 400-600% of Medicare rates. Notes employment-based Anthem enrollees cannot switch mid-year. NY Patient Bill of Rights: 90-day grace for chronic conditions. Hochul's 120-day extension proposal mentioned. Context: 53 hospitals lost in NY over two decades. Reaching significant portion of affected patient population that English media misses.",
  },
  {
    id: 77,
    date: "2026-03-04",
    source: "NYC Today",
    sourceType: "news",
    channel: "media",
    headline: "NYC Today: Thousands of New Yorkers Lose In-Network Care in Mount Sinai-Anthem Dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Anthem quote: 'We cannot agree to changes that would drastically increase costs for New Yorkers. We remain willing to reach a responsible agreement.' Notes Anthem network includes other major NYC health systems. Mt Sinai counters on patient protection provisions. Straight factual coverage. Both parties 'agreed to continue negotiating.'",
  },
  {
    id: 78,
    date: "2026-02-06",
    source: "NYC Today",
    sourceType: "news",
    channel: "media",
    headline: "NYC Today Feb: Thousands Face Disruption as Contract Dispute Continues — pre-breakdown coverage",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Early Feb coverage as March 1 deadline loomed. Focus on 200K patients at risk. Covers cooling-off period and continuity of care. Helped build public awareness before the actual March 4 breakdown.",
  },
  {
    id: 79,
    date: "2026-03-13",
    source: "Becker's Hospital Review / Payer Issues",
    sourceType: "news",
    channel: "media",
    headline: "Becker's: 'Mount Sinai reaches for the mic' — podcast and PR operation analyzed by trade press",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Trade press analysis of Mt Sinai's sophisticated PR response. 34-minute podcast, 'Setting the Record Straight' PDF, keepmountsinai.org, choosemountsinai.org. Mt Sinai official: 'At Thanksgiving, [Anthem] inexplicably said we are not doing anything we agreed to.' Leslie Schlachter PA-C: 'I'm not even involved and I'm very upset' — re: patient struggling for continuity of care approval. Molina exit also noted. Key trade audience: hospital administrators learning from Mt Sinai's playbook.",
  },
  {
    id: 80,
    date: "2026-01-09",
    source: "HR Brew",
    sourceType: "news",
    channel: "media",
    headline: "HR Brew: Employers may need to reconsider Anthem plans as Mt Sinai network gap persists",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "January coverage aimed at HR/benefits professionals. Key audience: employer decision-makers who choose insurance plans. If employers shift away from Anthem due to network adequacy concerns, that's the financial pressure point that matters most. 200K affected patients means significant employer exposure in NYC metro.",
  },
  {
    id: 81,
    date: "2026-03-17",
    source: "Manila Times (syndicated via GlobeNewswire)",
    sourceType: "news",
    channel: "media",
    headline: "Mt Sinai podcast press release syndicated internationally via Manila Times / GlobeNewswire",
    frameAdoption: "mtsinai",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "low",
    notes: "GlobeNewswire syndication of Mt Sinai podcast press release picked up by Manila Times and other international outlets. Demonstrates Mt Sinai's PR reach extending beyond US borders. International staff at UN and other NYC-based international organizations are affected patients.",
  },
  {
    id: 82,
    date: "2026-03-02",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "CBS: Mount Sinai, Anthem extend deadline to March 3 — John Esposito: 15 years with same doctor",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Jenna DeAngelis follow-up. Esposito (Huntington): 'I consider him my partner in keeping me healthy.' 15 years with same primary care physician. 'The idea of being turned into a health care refugee looking for a whole new set of doctors... it's a daunting thought.' Does NOT qualify for continuity of care. Mount Sinai statement: 'temporary terms through Tuesday, March 3, only.' Anthem: agreement will 'prevent patient care disruption and allow time to continue negotiations.' Extension lasted only 1 day.",
  },
  {
    id: 83,
    date: "2026-03-04",
    source: "CBS New York",
    sourceType: "tv",
    channel: "media",
    headline: "CBS Mar 4: Full breakdown confirmed — Lugo, Kim quoted, 32BJ Cora Opsahl, Brent Estes denials",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Alexa Herrera & Jenna DeAngelis. Massiel Lugo: 'I just wish they'd put their patients first, and not money.' Susan Kim (Upper West Side) scrambling. Cora Opsahl (32BJ health fund director): 'When hospitals and insurance companies can't come to agreement, hardworking people lose.' Brent Estes calls Anthem's consumer protection allegations 'completely false.' 32BJ retained access for 100K+ workers. Definitive breakdown coverage from most impactful local outlet.",
  },
  {
    id: 84,
    date: "2026-03-04",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "Crain's: Mount Sinai leaves Anthem's insurance network — confirms full split",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Definitive Crain's coverage of March 4 split. Business audience. Factual reporting. Notes both the $450M unpaid claims and Anthem's 50% increase claims. Business community reads Crain's — impacts employer perception of Anthem network reliability in NYC.",
  },
  {
    id: 85,
    date: "2025-11-25",
    source: "choosemountsinai.org",
    sourceType: "owned",
    channel: "media",
    headline: "choosemountsinai.org: Medicare Advantage patients can switch plans Jan 1–Mar 31 — Chapter.org partnership",
    frameAdoption: "mtsinai",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Medicare Advantage-specific campaign. Patient letter dated November 2025 informing Medicare patients of Jan 1 network exit. Partners with Chapter.org for enrollment assistance. One-time change allowed during Medicare Open Enrollment. Separate site from keepmountsinai.org (which targets commercial patients). Sophisticated two-track campaign targeting different patient populations.",
  },
  {
    id: 86,
    date: "2026-03-01",
    source: "keepmountsinai.org",
    sourceType: "owned",
    channel: "media",
    headline: "keepmountsinai.org: DFS complaint instructions — organized regulatory pressure campaign",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Dedicated page instructing patients to file complaints with NY DFS at 1-800-342-3736 or dfs.ny.gov/complaint. Also directs patients to call Anthem, contact employers/HR, pressure elected officials. This is organized regulatory arbitrage — if DFS gets flooded with complaints, it increases likelihood of state intervention. Strategic asymmetry: Anthem has no equivalent patient mobilization infrastructure.",
  },
  {
    id: 87,
    date: "2026-03-04",
    source: "MedCity News",
    sourceType: "news",
    channel: "media",
    headline: "MedCity News: Mount Sinai Drops Anthem Following Contract Dispute — trade press coverage",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Healthcare trade coverage aimed at industry professionals. Factual reporting of split. Notes both sides' competing claims. Key trade audience: healthcare executives tracking payer-provider dynamics nationally. Part of broader coverage trend positioning Mt Sinai/Anthem as emblematic of national crisis.",
  },
  {
    id: 88,
    date: "2025-12-17",
    source: "AANS / ACOI / Multiple Physician Orgs",
    sourceType: "other",
    channel: "stakeholder",
    headline: "Multiple physician organizations urge Anthem to withdraw nonparticipating provider penalty policy",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "AANS (American Association of Neurological Surgeons), ACOI, APMA, and others wrote to Elevance. Anthem's policy penalizes in-network hospitals 10% if any OON provider involved in care. Hospitals could be terminated for using OON specialists they don't employ. Broader industry opposition to Anthem's aggressive cost-control posture. Elevance 'rebuffed' calls to cancel. Context for Mt Sinai dispute: Anthem's national strategy pattern.",
  },
  {
    id: 89,
    date: "2025-08-26",
    source: "KFF Health News",
    sourceType: "news",
    channel: "media",
    headline: "KFF: 'When Hospitals and Insurers Fight, Patients Get Caught in the Middle' — national trend piece",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "Major national health policy coverage. Buxbaum data: 18% of non-federal hospitals had public dispute June 2021-May 2025, 8% went OON. ~500-600 annual disputes. Syndicated by WUWF, WUSF, GBH, InsuranceNewsNet. Notes federal transparency rules now force pricing disclosure — 'nobody wants to be the worst paid on the block.' Trump admin $1T healthcare cuts could accelerate. Mt Sinai dispute cited as illustrative example. Sets national narrative frame.",
  },
  {
    id: 90,
    date: "2026-01-01",
    source: "Anthem",
    sourceType: "owned",
    channel: "stakeholder",
    headline: "Anthem Continuity of Care: 90-day in-network extension for serious conditions — but excludes most patients",
    frameAdoption: "anthem",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "mtsinai",
    reachEstimate: "medium",
    notes: "Anthem extends COC for cancer, pregnancy, ongoing complex conditions, mental health, scheduled surgeries, hospitalization, terminal illness. BUT: most routine patients (like Esposito with 15-year PCP relationship) don't qualify. 90 days only. COC approval process itself is burdensome — Schlachter PA-C noted patient struggling to get approved. Anthem positioned as providing protection but scope is narrow. Key Anthem defensive messaging.",
  },
  {
    id: 91,
    date: "2026-04-01",
    source: "UnitedHealthcare / NewYork-Presbyterian",
    sourceType: "other",
    channel: "stakeholder",
    headline: "NYP/UHC: April 1 deadline for commercial, Medicaid, Medicare Advantage — second major NYC hospital dispute",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "high",
    notes: "NYP and UHC extended in-network through March 31, 2026. Individual/Family Plans already OON Jan 1. April 1 deadline for commercial, Medicaid, most Medicare Advantage. Continuity of care through June 29. CRITICAL context: undermines Anthem's 'every other system works with us' narrative — the OTHER major insurer is having the SAME problem with a DIFFERENT major NYC hospital. Systemic pattern, not Mt Sinai uniquely unreasonable.",
  },
  {
    id: 92,
    date: "2025-07-01",
    source: "UHC / Memorial Sloan Kettering",
    sourceType: "other",
    channel: "stakeholder",
    headline: "UHC/Memorial Sloan Kettering missed June 30 deadline — deal reached July 1 after brinkmanship",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Referenced in NBC News coverage. UHC and MSK went to the wire — missed deadline by one day but reached deal. Precedent for last-minute resolution. Suggests some disputes DO resolve. But Mt Sinai/Anthem has been much more protracted. Pattern: major NYC academic medical centers vs major insurers as recurring conflict.",
  },
  {
    id: 93,
    date: "2026-04-01",
    source: "Memorial Hermann / BCBS Texas",
    sourceType: "other",
    channel: "stakeholder",
    headline: "Memorial Hermann/BCBS TX: April 1 deadline for commercial plans, ended Medicare Advantage Jan 1",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "Referenced in NBC News national coverage. Another major health system in dispute with Blue Cross brand. Already ended Medicare Advantage relationship Jan 1. April 1 deadline for commercial. National pattern: BCBS plans specifically facing increased provider pushback. Mt Sinai/Anthem not isolated — part of Elevance/BCBS national strategy generating provider resistance.",
  },
  {
    id: 94,
    date: "2026-03-04",
    source: "News 12 Bronx",
    sourceType: "tv",
    channel: "media",
    headline: "News 12 Bronx: cross-posts LI coverage — expands suburban story to broader NYC metro audience",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: true,
    blameDirection: "anthem",
    reachEstimate: "medium",
    notes: "Same content as News 12 LI but reaching Bronx audience. Fischman family story crosses borough boundaries. Demonstrates how local TV coverage amplifies across News 12's multi-market footprint. Bronx has significant Anthem/Medicaid managed care enrollment — overlap with Molina Medicaid exit.",
  },
  {
    id: 95,
    date: "2026-03-09",
    source: "Crain's New York Business",
    sourceType: "news",
    channel: "media",
    headline: "Crain's: 32BJ deal details — 5,000 contributing employers, Northwell precedent cited, $46M savings",
    frameAdoption: "mtsinai",
    sentiment: "negative_anthem",
    patientStory: false,
    blameDirection: "anthem",
    reachEstimate: "high",
    notes: "Claire Brockbank (32BJ policy director), Peter Goldberger (exec director 32BJ benefits). $27,188 avg family coverage cost in NY (2024). 3.2% premium increase 2023-24. Second systemwide direct contract after Northwell ($46M first-year savings, 20% reduction). 5,000 employers contribute. Parties intend to maintain 'forever.' More comprehensive agreement within 6 months. Growing trend of self-insured employers bypassing insurance middlemen entirely.",
  },
];

const LABELS = {
  frameAdoption: { mtsinai: "Mt Sinai Frame", anthem: "Anthem Frame", balanced: "Balanced" },
  sentiment: {
    negative_anthem: "Anti-Anthem",
    negative_mtsinai: "Anti-Mt Sinai",
    neutral: "Neutral",
    positive_anthem: "Pro-Anthem",
    positive_mtsinai: "Pro-Mt Sinai",
  },
  blameDirection: { anthem: "Blames Anthem", mtsinai: "Blames Mt Sinai", both: "Both/Neither" },
  reachEstimate: { high: "High", medium: "Medium", low: "Low" },
  sourceType: { news: "Print/Online News", tv: "TV", radio: "Radio", owned: "Owned Media", social: "Social/Forum", opinion: "Op-Ed/Expert" },
  channel: { media: "Media", social: "Social/Forum", stakeholder: "Stakeholder" },
};

const COLORS = {
  mtsinai: "#06ABEB",
  anthem: "#DC298D",
  neutral: "#465E85",
  negative_anthem: "#06ABEB",
  negative_mtsinai: "#DC298D",
  positive_anthem: "#DC298D",
  positive_mtsinai: "#06ABEB",
  accent: "#06ABEB",
  bg: "#00002D",
  surface: "#0A0A3D",
  surfaceHover: "#12124A",
  border: "#1A1A5A",
  text: "#E8EAF6",
  textMuted: "#8A8DB8",
  red: "#06ABEB",
  green: "#00B2A9",
  amber: "#06ABEB",
};

function computeScores(entries) {
  const total = entries.length || 1;
  const mediaEntries = entries.filter((e) => e.channel === "media");
  const socialEntries = entries.filter((e) => e.channel === "social");
  const stakeholderEntries = entries.filter((e) => e.channel === "stakeholder");

  const frameMtSinai = entries.filter((e) => e.frameAdoption === "mtsinai").length;
  const frameAnthem = entries.filter((e) => e.frameAdoption === "anthem").length;
  const frameScore = ((frameMtSinai - frameAnthem) / total) * 100;

  const sentNegAnthem = entries.filter((e) => e.sentiment === "negative_anthem" || e.sentiment === "positive_mtsinai").length;
  const sentNegMtSinai = entries.filter((e) => e.sentiment === "negative_mtsinai" || e.sentiment === "positive_anthem").length;
  const sentScore = ((sentNegAnthem - sentNegMtSinai) / total) * 100;

  const blameAnthem = entries.filter((e) => e.blameDirection === "anthem").length;
  const blameMtSinai = entries.filter((e) => e.blameDirection === "mtsinai").length;
  const blameScore = ((blameAnthem - blameMtSinai) / total) * 100;

  const patientStories = entries.filter((e) => e.patientStory).length;
  const patientScore = (patientStories / total) * 100;

  const composite = frameScore * 0.3 + sentScore * 0.3 + blameScore * 0.25 + patientScore * 0.15;

  return {
    total,
    mediaCount: mediaEntries.length,
    socialCount: socialEntries.length,
    stakeholderCount: stakeholderEntries.length,
    frameScore,
    sentScore,
    blameScore,
    patientScore,
    composite,
    frameMtSinai,
    frameAnthem,
    frameBalanced: entries.filter((e) => e.frameAdoption === "balanced").length,
    sentNegAnthem,
    sentNegMtSinai,
    sentNeutral: entries.filter((e) => e.sentiment === "neutral").length,
    blameAnthem,
    blameMtSinai,
    blameBoth: entries.filter((e) => e.blameDirection === "both").length,
    patientStories,
  };
}

function computeTrend(entries) {
  if (entries.length === 0) return [];
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const dateMap = {};
  sorted.forEach((e) => {
    if (!dateMap[e.date]) dateMap[e.date] = [];
    dateMap[e.date].push(e);
  });
  const dates = Object.keys(dateMap).sort();
  const points = [];
  const cumulative = [];
  dates.forEach((d) => {
    cumulative.push(...dateMap[d]);
    const s = computeScores(cumulative);
    points.push({ date: d, composite: s.composite, count: cumulative.length, frame: s.frameScore, sent: s.sentScore, blame: s.blameScore });
  });
  return points;
}

function TrendChart({ entries, filterChannel }) {
  const allTrend = useMemo(() => computeTrend(entries), [entries]);
  const channelTrend = useMemo(() => {
    if (filterChannel === "all") return null;
    const channelEntries = entries.filter((e) => e.channel === filterChannel);
    if (channelEntries.length < 2) return null;
    return computeTrend(channelEntries);
  }, [entries, filterChannel]);

  if (allTrend.length < 2) return null;

  const W = 680, H = 160, PX = 50, PY = 24;
  const plotW = W - PX * 2, plotH = H - PY * 2;

  const allVals = allTrend.map((t) => t.composite);
  const chVals = channelTrend ? channelTrend.map((t) => t.composite) : [];
  const combined = [...allVals, ...chVals];
  const maxAbs = Math.max(Math.abs(Math.min(...combined)), Math.abs(Math.max(...combined)), 30);
  const yMin = -maxAbs, yMax = maxAbs;

  const allDates = allTrend.map((t) => t.date);
  const x = (i) => PX + (i / (allDates.length - 1)) * plotW;
  const y = (v) => PY + ((yMax - v) / (yMax - yMin)) * plotH;
  const zeroY = y(0);

  const aggLinePoints = allTrend.map((t, i) => `${x(i)},${y(t.composite)}`).join(" ");

  const areaAbove = [];
  const areaBelow = [];
  allTrend.forEach((t, i) => {
    const px = x(i), py = y(t.composite);
    if (t.composite >= 0) {
      areaAbove.push(`${px},${py}`);
      areaBelow.push(`${px},${zeroY}`);
    } else {
      areaAbove.push(`${px},${zeroY}`);
      areaBelow.push(`${px},${py}`);
    }
  });
  const areaAbovePath = `M${PX},${zeroY} L${areaAbove.join(" L")} L${x(allTrend.length - 1)},${zeroY} Z`;
  const areaBelowPath = `M${PX},${zeroY} L${areaBelow.join(" L")} L${x(allTrend.length - 1)},${zeroY} Z`;

  let chLinePoints = "";
  let chDots = [];
  const chColorMap = { media: "#06ABEB", social: "#00B2A9", stakeholder: "#DC298D" };
  const chColor = chColorMap[filterChannel] || COLORS.accent;
  const chLabelMap = { media: "MEDIA", social: "SOCIAL", stakeholder: "STAKEHOLDER" };

  if (channelTrend) {
    const chDateIndex = {};
    allDates.forEach((d, i) => { chDateIndex[d] = i; });
    const mappedPoints = channelTrend.map((ct) => {
      let idx = chDateIndex[ct.date];
      if (idx === undefined) {
        let best = 0, bestDiff = Infinity;
        allDates.forEach((d, i) => { const diff = Math.abs(new Date(d) - new Date(ct.date)); if (diff < bestDiff) { bestDiff = diff; best = i; } });
        idx = best;
      }
      return { x: x(idx), y: y(ct.composite), composite: ct.composite, count: ct.count, date: ct.date };
    });
    chLinePoints = mappedPoints.map((p) => `${p.x},${p.y}`).join(" ");
    chDots = mappedPoints;
  }

  const gridLines = [-20, 0, 20];
  const fmtDate = (d) => { const parts = d.split("-"); return `${parts[1]}/${parts[2]}`; };
  const isOverlay = filterChannel !== "all" && channelTrend;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 10, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          NARRATIVE MOMENTUM — CUMULATIVE COMPOSITE OVER TIME
        </div>
        {isOverlay && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 2, background: COLORS.accent, display: "inline-block", borderRadius: 1 }} />
              <span style={{ color: COLORS.textMuted }}>ALL</span>
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 16, height: 3, background: chColor, display: "inline-block", borderRadius: 1 }} />
              <span style={{ color: chColor, fontWeight: 700 }}>{chLabelMap[filterChannel]}</span>
            </span>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
        {gridLines.map((v) => (
          <g key={v}>
            <line x1={PX} y1={y(v)} x2={W - PX} y2={y(v)} stroke={v === 0 ? COLORS.textMuted : COLORS.border} strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? "" : "4,4"} opacity={v === 0 ? 0.6 : 0.4} />
            <text x={PX - 6} y={y(v) + 3.5} textAnchor="end" fill={COLORS.textMuted} fontSize="9" fontFamily="'JetBrains Mono', monospace">
              {v > 0 ? "+" : ""}{v}
            </text>
          </g>
        ))}
        <text x={PX - 6} y={PY - 8} textAnchor="end" fill={COLORS.mtsinai} fontSize="8" fontFamily="'JetBrains Mono', monospace">SINAI</text>
        <text x={PX - 6} y={H - PY + 14} textAnchor="end" fill={COLORS.anthem} fontSize="8" fontFamily="'JetBrains Mono', monospace">ANTHEM</text>
        {allTrend.map((t, i) => (
          (i === 0 || i === allTrend.length - 1 || (allTrend.length > 5 && i === Math.floor(allTrend.length / 2))) ? (
            <text key={i} x={x(i)} y={H - 2} textAnchor="middle" fill={COLORS.textMuted} fontSize="8" fontFamily="'JetBrains Mono', monospace">
              {fmtDate(t.date)}
            </text>
          ) : null
        ))}
        <path d={areaAbovePath} fill={COLORS.mtsinai} opacity={isOverlay ? 0.06 : 0.12} />
        <path d={areaBelowPath} fill={COLORS.anthem} opacity={isOverlay ? 0.06 : 0.12} />
        <polyline points={aggLinePoints} fill="none" stroke={COLORS.accent} strokeWidth={isOverlay ? 1.5 : 2.5} strokeLinejoin="round" strokeLinecap="round" opacity={isOverlay ? 0.4 : 1} />
        {allTrend.map((t, i) => {
          const dotColor = t.composite > 10 ? COLORS.mtsinai : t.composite < -10 ? COLORS.anthem : COLORS.accent;
          return (
            <g key={i} opacity={isOverlay ? 0.3 : 1}>
              <circle cx={x(i)} cy={y(t.composite)} r={isOverlay ? 3 : 4} fill={COLORS.bg} stroke={dotColor} strokeWidth={2} />
              {!isOverlay && (
                <>
                  <text x={x(i)} y={y(t.composite) - 8} textAnchor="middle" fill={dotColor} fontSize="8" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                    {t.composite > 0 ? "+" : ""}{t.composite.toFixed(0)}
                  </text>
                  <text x={x(i)} y={y(t.composite) + 12} textAnchor="middle" fill={COLORS.textMuted} fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity={0.6}>
                    n={t.count}
                  </text>
                </>
              )}
            </g>
          );
        })}
        {isOverlay && chLinePoints && (
          <polyline points={chLinePoints} fill="none" stroke={chColor} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {isOverlay && chDots.map((p, i) => (
          <g key={`ch${i}`}>
            <circle cx={p.x} cy={p.y} r={5} fill={COLORS.bg} stroke={chColor} strokeWidth={2.5} />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fill={chColor} fontSize="9" fontWeight="700" fontFamily="'JetBrains Mono', monospace">
              {p.composite > 0 ? "+" : ""}{p.composite.toFixed(0)}
            </text>
            <text x={p.x} y={p.y + 14} textAnchor="middle" fill={COLORS.textMuted} fontSize="7" fontFamily="'JetBrains Mono', monospace" opacity={0.7}>
              n={p.count}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ScoreGauge({ value, label, subtext }) {
  const clamped = Math.max(-100, Math.min(100, value));
  const pct = ((clamped + 100) / 200) * 100;
  const color = clamped > 15 ? COLORS.mtsinai : clamped < -15 ? COLORS.anthem : "#8A8DB8";
  const winner = clamped > 10 ? "→ Mt Sinai Advantage" : clamped < -10 ? "→ Anthem Advantage" : "→ Contested";

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{label}</span>
        <span style={{ fontSize: 11, color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
          {clamped > 0 ? "+" : ""}
          {clamped.toFixed(0)} {winner}
        </span>
      </div>
      <div style={{ height: 8, background: COLORS.border, borderRadius: 4, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: COLORS.textMuted, opacity: 0.4, zIndex: 2 }} />
        <div
          style={{
            position: "absolute",
            left: clamped >= 0 ? "50%" : `${pct}%`,
            width: `${Math.abs(clamped) / 2}%`,
            top: 0,
            bottom: 0,
            background: color,
            borderRadius: 4,
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>Anthem Winning</span>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>{subtext}</span>
        <span style={{ fontSize: 10, color: COLORS.textMuted }}>Mt Sinai Winning</span>
      </div>
    </div>
  );
}

function DistBar({ label, values, colors, labels: segLabels }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4, fontFamily: "'JetBrains Mono', monospace" }}>{label}</div>
      <div style={{ display: "flex", height: 24, borderRadius: 4, overflow: "hidden", gap: 1 }}>
        {values.map((v, i) =>
          v > 0 ? (
            <div
              key={i}
              style={{
                width: `${(v / total) * 100}%`,
                background: colors[i],
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                minWidth: v > 0 ? 28 : 0,
              }}
            >
              {v} {segLabels[i]}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

function EntryRow({ entry, onDelete }) {
  const sentColor =
    entry.sentiment === "negative_anthem" || entry.sentiment === "positive_mtsinai"
      ? COLORS.mtsinai
      : entry.sentiment === "negative_mtsinai" || entry.sentiment === "positive_anthem"
      ? COLORS.anthem
      : COLORS.textMuted;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
        gap: 8,
        padding: "10px 12px",
        borderBottom: `1px solid ${COLORS.border}`,
        alignItems: "center",
        fontSize: 12,
        color: COLORS.text,
      }}
    >
      <span style={{ color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{entry.date}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 12, lineHeight: 1.3 }}>{entry.headline || entry.source}</div>
        <div style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 2 }}>
          {entry.source} · {LABELS.sourceType[entry.sourceType]} {entry.patientStory ? " · 👤 Patient story" : ""}
        </div>
        {entry.notes && <div style={{ color: COLORS.textMuted, fontSize: 10, marginTop: 3, fontStyle: "italic", lineHeight: 1.4 }}>{entry.notes}</div>}
      </div>
      <span
        style={{
          fontSize: 10,
          padding: "3px 8px",
          borderRadius: 3,
          fontWeight: 700,
          fontFamily: "'JetBrains Mono', monospace",
          background: entry.frameAdoption === "mtsinai" ? "#0A3A5C" : entry.frameAdoption === "anthem" ? "#3D0A2A" : "#1A1A5A",
          color: entry.frameAdoption === "mtsinai" ? "#06ABEB" : entry.frameAdoption === "anthem" ? "#DC298D" : "#8A8DB8",
          textAlign: "center",
        }}
      >
        {LABELS.frameAdoption[entry.frameAdoption]}
      </span>
      <span style={{ color: sentColor, fontWeight: 600, fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
        {LABELS.sentiment[entry.sentiment]}
      </span>
      <span style={{ fontSize: 10, color: COLORS.textMuted }}>{LABELS.reachEstimate[entry.reachEstimate]} reach</span>
      <button
        onClick={() => onDelete(entry.id)}
        style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 14, padding: 2 }}
        title="Remove entry"
      >
        ✕
      </button>
    </div>
  );
}

function AddEntryForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    source: "",
    sourceType: "news",
    channel: "media",
    headline: "",
    frameAdoption: "balanced",
    sentiment: "neutral",
    patientStory: false,
    blameDirection: "both",
    reachEstimate: "medium",
    notes: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.source) return;
    onAdd({ ...form, id: Date.now() });
    setForm({
      date: new Date().toISOString().split("T")[0],
      source: "",
      sourceType: "news",
      channel: "media",
      headline: "",
      frameAdoption: "balanced",
      sentiment: "neutral",
      patientStory: false,
      blameDirection: "both",
      reachEstimate: "medium",
      notes: "",
    });
    setOpen(false);
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          width: "100%",
          padding: "12px",
          background: COLORS.surface,
          border: `1px dashed ${COLORS.border}`,
          borderRadius: 6,
          color: COLORS.accent,
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        + LOG NEW ENTRY
      </button>
    );

  const selectStyle = {
    background: COLORS.bg,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    color: COLORS.text,
    padding: "6px 8px",
    fontSize: 12,
    flex: 1,
    minWidth: 0,
  };
  const inputStyle = { ...selectStyle };

  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent, marginBottom: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        NEW ENTRY
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} style={{ ...inputStyle, maxWidth: 150 }} />
        <input placeholder="Source (e.g. CBS New York)" value={form.source} onChange={(e) => update("source", e.target.value)} style={inputStyle} />
        <select value={form.sourceType} onChange={(e) => update("sourceType", e.target.value)} style={selectStyle}>
          {Object.entries(LABELS.sourceType).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={form.channel} onChange={(e) => update("channel", e.target.value)} style={selectStyle}>
          {Object.entries(LABELS.channel).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <input
        placeholder="Headline or post summary"
        value={form.headline}
        onChange={(e) => update("headline", e.target.value)}
        style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 8 }}
      />
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <select value={form.frameAdoption} onChange={(e) => update("frameAdoption", e.target.value)} style={selectStyle}>
          <option value="" disabled>Frame adoption</option>
          {Object.entries(LABELS.frameAdoption).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={form.sentiment} onChange={(e) => update("sentiment", e.target.value)} style={selectStyle}>
          <option value="" disabled>Sentiment</option>
          {Object.entries(LABELS.sentiment).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={form.blameDirection} onChange={(e) => update("blameDirection", e.target.value)} style={selectStyle}>
          <option value="" disabled>Blame direction</option>
          {Object.entries(LABELS.blameDirection).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={form.reachEstimate} onChange={(e) => update("reachEstimate", e.target.value)} style={selectStyle}>
          <option value="" disabled>Reach</option>
          {Object.entries(LABELS.reachEstimate).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
        <label style={{ fontSize: 12, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
          <input type="checkbox" checked={form.patientStory} onChange={(e) => update("patientStory", e.target.checked)} />
          Includes patient story
        </label>
      </div>
      <textarea
        placeholder="Analyst notes (optional)"
        value={form.notes}
        onChange={(e) => update("notes", e.target.value)}
        rows={2}
        style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: 10, resize: "vertical" }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={submit}
          style={{
            padding: "8px 20px",
            background: COLORS.accent,
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          ADD ENTRY
        </button>
        <button
          onClick={() => setOpen(false)}
          style={{ padding: "8px 16px", background: "none", color: COLORS.textMuted, border: `1px solid ${COLORS.border}`, borderRadius: 4, cursor: "pointer", fontSize: 12 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function MtSinaiDashboard() {
  const [entries, setEntries] = useState(INITIAL_ENTRIES);
  const [filterChannel, setFilterChannel] = useState("all");

  const filtered = useMemo(
    () => (filterChannel === "all" ? entries : entries.filter((e) => e.channel === filterChannel)),
    [entries, filterChannel]
  );
  const scores = useMemo(() => computeScores(filtered), [filtered]);

  const addEntry = useCallback((entry) => setEntries((prev) => [...prev, entry]), []);
  const deleteEntry = useCallback((id) => setEntries((prev) => prev.filter((e) => e.id !== id)), []);

  const compositeColor = scores.composite > 15 ? COLORS.mtsinai : scores.composite < -15 ? COLORS.anthem : "#8A8DB8";
  const compositeLabel = scores.composite > 15 ? "MT SINAI LEADING" : scores.composite < -15 ? "ANTHEM LEADING" : "CONTESTED";

  return (
    <div
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        minHeight: "100vh",
        fontFamily: "'Source Serif 4', Georgia, serif",
        padding: "24px 20px",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 10, letterSpacing: 3, color: COLORS.accent, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
            NARRATIVE INTELLIGENCE
          </span>
          <span style={{ height: 1, flex: 1, background: COLORS.border }} />
        </div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 }}>
          PR War Room <span style={{ color: COLORS.textMuted, fontWeight: 400 }}>— Mt Sinai vs Anthem BCBS</span>
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>
          Contract dispute · Out of network since March 4, 2026 · {filtered.length} entries tracked
        </p>
      </div>

      {/* Composite Score */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.surface}, ${COLORS.bg})`,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 10,
          padding: "20px 24px",
          marginBottom: 20,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: compositeColor }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 2, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 6 }}>
              COMPOSITE NARRATIVE ADVANTAGE
            </div>
            <div style={{ fontSize: 40, fontWeight: 700, color: compositeColor, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>
              {scores.composite > 0 ? "+" : ""}
              {scores.composite.toFixed(1)}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: compositeColor, marginTop: 4 }}>{compositeLabel}</div>
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: COLORS.textMuted, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>
            <div>Frame Adoption (30%): <span style={{ color: COLORS.text }}>{scores.frameScore > 0 ? "+" : ""}{scores.frameScore.toFixed(0)}</span></div>
            <div>Sentiment (30%): <span style={{ color: COLORS.text }}>{scores.sentScore > 0 ? "+" : ""}{scores.sentScore.toFixed(0)}</span></div>
            <div>Blame Direction (25%): <span style={{ color: COLORS.text }}>{scores.blameScore > 0 ? "+" : ""}{scores.blameScore.toFixed(0)}</span></div>
            <div>Patient Story Saturation (15%): <span style={{ color: COLORS.text }}>{scores.patientScore.toFixed(0)}%</span></div>
          </div>
        </div>
        <TrendChart entries={entries} filterChannel={filterChannel} />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[
          ["all", `All (${entries.length})`],
          ["media", `Media (${entries.filter((e) => e.channel === "media").length})`],
          ["social", `Social (${entries.filter((e) => e.channel === "social").length})`],
          ["stakeholder", `Stakeholder (${entries.filter((e) => e.channel === "stakeholder").length})`],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilterChannel(k)}
            style={{
              padding: "6px 14px",
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600,
              borderRadius: 4,
              border: "none",
              cursor: "pointer",
              background: filterChannel === k ? COLORS.accent : COLORS.surface,
              color: filterChannel === k ? "#fff" : COLORS.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Gauges + Distributions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DIMENSION SCORES
          </div>
          <ScoreGauge value={scores.frameScore} label="Frame Adoption" subtext="Whose numbers get cited?" />
          <ScoreGauge value={scores.sentScore} label="Sentiment" subtext="Tone of coverage" />
          <ScoreGauge value={scores.blameScore} label="Blame Direction" subtext="Who's the villain?" />
          <div style={{ marginTop: 8, padding: "8px 10px", background: COLORS.bg, borderRadius: 4, fontSize: 11, color: COLORS.textMuted }}>
            <strong style={{ color: COLORS.accent }}>Patient Story Saturation:</strong>{" "}
            {scores.patientStories}/{scores.total} entries ({scores.patientScore.toFixed(0)}%) — favors Mt Sinai as provider
          </div>
        </div>

        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace", marginBottom: 14 }}>
            DISTRIBUTIONS
          </div>
          <DistBar
            label="FRAME ADOPTION"
            values={[scores.frameMtSinai, scores.frameBalanced, scores.frameAnthem]}
            colors={["#06ABEB", "#465E85", "#DC298D"]}
            labels={["SINAI", "BAL", "ANTHEM"]}
          />
          <DistBar
            label="SENTIMENT"
            values={[scores.sentNegAnthem, scores.sentNeutral, scores.sentNegMtSinai]}
            colors={["#06ABEB", "#465E85", "#DC298D"]}
            labels={["Anti-Anthem", "Neutral", "Anti-Sinai"]}
          />
          <DistBar
            label="BLAME DIRECTION"
            values={[scores.blameAnthem, scores.blameBoth, scores.blameMtSinai]}
            colors={["#06ABEB", "#465E85", "#DC298D"]}
            labels={["Anthem", "Both", "Sinai"]}
          />
          <div style={{ marginTop: 16, padding: 12, background: COLORS.bg, borderRadius: 6, fontSize: 11, lineHeight: 1.7, color: COLORS.textMuted }}>
            <strong style={{ color: COLORS.accent }}>SCORING METHODOLOGY</strong>
            <br />
            Each dimension: (pro-Mt Sinai count − pro-Anthem count) / total × 100
            <br />
            Positive = Mt Sinai winning · Negative = Anthem winning
            <br />
            Composite = Frame(30%) + Sentiment(30%) + Blame(25%) + PatientStory(15%)
            <br />
            <span style={{ color: COLORS.text }}>Add social/forum and stakeholder entries to strengthen the signal.</span>
          </div>
        </div>
      </div>

      {/* Per-channel Entry Logs */}
      {(filterChannel === "all" ? ["media", "social", "stakeholder"] : [filterChannel]).map((ch) => {
        const chEntries = entries.filter((e) => e.channel === ch).sort((a, b) => b.date.localeCompare(a.date));
        const chLabel = ch === "media" ? "MEDIA" : ch === "social" ? "SOCIAL / FORUM" : "STAKEHOLDER";
        const chColor = ch === "media" ? "#06ABEB" : ch === "social" ? "#00B2A9" : "#DC298D";
        return (
          <div key={ch} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: chColor, display: "inline-block" }} />
                <span style={{ fontSize: 11, letterSpacing: 1.5, color: COLORS.textMuted, fontFamily: "'JetBrains Mono', monospace" }}>{chLabel} LOG</span>
              </div>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{chEntries.length} entries</span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "90px 1fr 100px 90px 90px 36px",
                gap: 8,
                padding: "8px 12px",
                borderBottom: `1px solid ${COLORS.border}`,
                fontSize: 10,
                color: COLORS.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: 0.5,
              }}
            >
              <span>DATE</span>
              <span>SOURCE / HEADLINE</span>
              <span>FRAME</span>
              <span>SENTIMENT</span>
              <span>REACH</span>
              <span></span>
            </div>
            {chEntries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} onDelete={deleteEntry} />
            ))}
          </div>
        );
      })}

      {/* Add entry form */}
      <AddEntryForm onAdd={addEntry} />
    </div>
  );
}
