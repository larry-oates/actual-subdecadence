import React, { useState, useEffect } from "react";
import { Shuffle, Play, RotateCcw, Eye } from "lucide-react";

const Subdecadence = () => {
  const [gameMode, setGameMode] = useState("actual-subdecadence");
  const [deck, setDeck] = useState([]);
  const [crossCards, setCrossCards] = useState([]);
  const [setCards, setSetCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [selectedMatchCard, setSelectedMatchCard] = useState(null);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedCardIndex, setDraggedCardIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentScore, setCurrentScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [aeonTotal, setAeonTotal] = useState(0);
  const [aeonScores, setAeonScores] = useState([]);
  const [summonedLemur, setSummonedLemur] = useState(null);
  const [gameState, setGameState] = useState("idle");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const suits = ["♥", "♦", "♣", "♠"];

  const lemurs = [
    { mesh: 0, name: "Lurgo (Legba)", details: "(Terminal) Initiator. (Clicks Gt-00). Pitch Ana-1. Net-Span 1::0. Amphidemon of Openings. (The Door of Doors). Cipher Gt-01, Gt-10. 1st Door (The Pod) [Mercury], Dorsal. 1st Phase-limit. Decadology. C/tp-#7, Mj+ [7C]. Rt-1:[1890] Spinal-voyage (fate line), programming." },
    { mesh: 1, name: "Duoddod", details: "Duplicitous Redoubler. (Clicks Gt-01). Pitch Ana-2. Net-Span 2::0. Amphidemon of Abstract Addiction 2nd Door (The Crypt) [Venus], Cervical. Decadology. C/tp-#8, Mj+ [8C]. Rt-1:[271890] Pineal-regression (rear vision). Rt-2:[27541890] Datacomb searches, digital exactitude (every second counts). [+1 sub-Rt]." },
    { mesh: 2, name: "Doogu (The Blob)", details: "Original-Schism. Pitch Ana-3. Net-Span 2::1 Cyclic Chronodemon of Splitting-Waters. Ciphers Gt-21. Shadows Surge-Current. 2nd Phase-limit. Decadology. C/tp-#1 Mn+ [1H]. Rt-1:[1872] Mn. Primordial breath (pneumatic practices). Rt-2:[271] Ambivalent capture, hooks (live-bait, traps, plot-twists) Rt-3:[27541] Mj. Slow pull to stasis, protection from drowning. [+1 sub-Rt]." },
    { mesh: 3, name: "Ixix (Yix)", details: "Abductor. (Clicks Gt-03). Pitch Ana-3 Net-Span 3::0 Chaotic Xenodemon of Cosmic Indifference. Ciphers Gt-03. 3rd Door (The Swirl), [Earth]. Cranial. Rt-0:[?]. Occult terrestrial history (Who does the Earth think It Is?)" },
    { mesh: 4, name: "Ixigool (Djinn of the Magi)", details: "Over-Ghoul. Pitch Ana-4. Net Span 3::1 Amphidemon of Tridentity (Sphinx-time). Decadology. C/tp-#4, Mn+ [4H]. Rt-1:[18723]. Unimpeded ascent (prophecy). Rt-2:[1872563]. Ultimate implications, (as above so below). [+1 sub-Rt]." },
    { mesh: 5, name: "Ixidod (King Sid)", details: "The Zombie-Maker. Pitch Ana-5. Net Span 3::2 Amphidemon of Escape-velocity. Haunts Gt-03. 3rd Phase-limit. Decadology. C/tp-#5, Mn+ [5H]. Rt-1:[23] Crises through excess (micropause abuse) Rt-2:[27563] Illusion of progress (out of the frying-pan into the fire). [+1 sub-Rt]." },
    { mesh: 6, name: "Krako (Kru, Karak-oa)", details: "The Croaking Curse. Pitch Ana-4 Net-Span 4::0 Amphidemon of Burning-Hail 4th Door (Delta) Mars. Cervical Decadology. C/tp-#9, Mj+ [9C]. Rt-1:[41890] Subsidence, heaviness of fatality. [+1 sub-Rt]." },
    { mesh: 7, name: "Sukugool (Old Skug)", details: "The Sucking-Ghoul. Pitch Ana-5. Net-Span 4::1 Cyclic Chronodemon of deluge and implosion. Prowls Sink-Current. Haunts Gt-10 Decadology. C/tp-#3, Mj+ [3C]. Rt-1:[187254] Mn. Cycle of creation and destruction. Rt-2:[41] Mj. Submersion (gravedigging). [+1 sub-Rt]." },
    { mesh: 8, name: "Skoodu (Li'l Scud)", details: "The Fashioner. Pitch Ana-6 Net-Span 4::2 Cyclic Chronodemon of Switch-Crazes. Shadows Hold-Current Decadology. C/tp-#2, Mn+ [2H]. Rt-1:[2754] Mn. Historical time (eschatology). Rt-2:[41872] Passage through the deep. Rt-3:[451872] Mj. Cyclic reconstitution and stability." },
    { mesh: 9, name: "Skarkix (Sharky, Scar-head)", details: "Buzz-Cutter. Pitch Ana-7 (Uppermost). Net-Span 4::3 Amphidemon of anti-evolution (eddies of the Delta). 4th Phase-limit. Decadology. C/tp-#6, Mj+ [6C]. Rt-1:[418723] Hermetic abbreviations (history of the magicians). Rt-2:[4518723] Sacred seal of time (triadic reconfirmation of the cycle). Rt-3:[4563] Apocalyptic rapture (jagged turbulence). [+1 sub-Rt]." },
    { mesh: 10, name: "Tokhatto (Old Toker, Top Cat)", details: "Decimal Camouflage. Pitch Cth-4 Net-Span 5::0 Amphidemon of Talismania. 5th Door (Hyperborea) [Jupiter], Cervical. Decadology. C/tp-#9, Mj- [9S]. Angel of the Cards. Rt-1:[541890] Number as destiny (digital convergence). [+1 sub-Rt]." },
    { mesh: 11, name: "Tukkamu", details: "Occulturation. Pitch Cth-3. Net-Span 5::1 Cyclic Chronodemon of Pathogenesis. Ciphers Gt-15. Prowls Sink-Current Decadology. C/tp-#3, Mj- [3S]. Rt-1:[18725] Mn. Optimal maturation (medicine as diffuse healing). Rt-2:[541] Mj. Rapid deterioration (putrefaction, catabolism). [+1 sub-Rt]." },
    { mesh: 12, name: "Kuttadid (Kitty)", details: "Ticking Machines. Pitch Cth-2 Net-Span 5::2 Cyclic Chronodemon of Precarious States. Prowls Hold-Current Decadology. C/tp-#2, Mn- [2D]. Rt-1:[275] Mn. Maintaining balance (calendric conservatism). Rt-2:[541872] Mj. Exhaustive vigilance. [+1 sub-Rt]." },
    { mesh: 13, name: "Tikkitix (Tickler)", details: "Clicking Menaces. Pitch Cth-1 Net-Span 5::3 Amphidemon of Vortical Delirium Decadology. C/tp-#6, Mj- [6S]. Rt-1:[5418723] Swirl-patterns (tornadoes, wind-voices). [+1 sub-Rt]. Rt-2:[563] Mysterious disappearances (things carried-away). [+1 sub-Rt]." },
    { mesh: 14, name: "Katak", details: "Desolator. Pitch Null. Net-Span 5::4 Syzygetic Chronodemon of Cataclysmic Convergence. Feeds Sink-Current. Ciphers Gt-45 5th Phase limit Decadology. C/tp-#0 [Joker]. Rt-0:[X] Tail-chasing, rabid animals (nature red in tooth and claw). Rt-1:[418725] Panic (slasher pulp and religious fervour)." },
    { mesh: 15, name: "Tchu (Tchanul)", details: "Source of Subnothingness. Pitch Cth-3 Net-Span 6::0 Chaotic Xenodemon of Ultimate Outsideness (and unnamable things). 6th Door (Undu) [Saturn].Cranial Rt-0:[?] Cosmic deletions and real impossibilities." },
    { mesh: 16, name: "Djungo", details: "Infiltrator. Pitch Cth-2 Net Span 6::1 Amphidemon of Subtle Involvements (and intricate puzzles). Decadology. C/tp-#4, Mn- [4D]. Rt-1:[187236] Turbular fluids (maelstroms, chaotic incalculability). [+1 sub-Rt]. Rt-2:[187256] Surreptitious invasions, inexplicable contaminations (fish falls)." },
    { mesh: 17, name: "Djuddha (Judd Dread)", details: "Decentred Threat. Pitch Cth-2 Net-Span 6::2 Amphidemon of Artificial Turbulence (complex-dynamics simulations) Decadology. C/tp-#5, Mn- [5D]. Rt-1:[236] Machine-vortex (seething skin). [+1 sub-Rt]. Rt-2:[256] Storm peripheries (Wendigo legends)." },
    { mesh: 18, name: "Djynxx (Ching, The Jinn)", details: "Child Stealer. Pitch Null Net-Span 6::3 Syzygetic Xenodemon of Time-Lapse. Feeds and Prowls Warp-Current. Ciphers Gt-36. Haunts Gt-06, Gt-21. Rt-0:[X] Abstract cyclones, dust spirals (nomad war-machine). [+2 sub-Rt]." },
    { mesh: 19, name: "Tchakki (Chuckles)", details: "Bag of Tricks. Pitch Ana-1. Net-Span 6::4 Amphidemon of Combustion. Decadology. C/tp-#6, Mn+ [6H]. 1st Decademon. Rt-1:[4187236] Quenching accidents (apprentice smiths). [+1 sub-Rt]. Rt-2:[45187236] Mappings between incompatible time-systems (Herakleitean fire-cycle). [+1 sub-Rt]. Rt-3:[456] Conflagrations (shrieking deliria, spontaneous combustion)." },
    { mesh: 20, name: "Tchattuk (One Eyed Jack, Djatka)", details: "Pseudo-Basis. Pitch Cth-7 (Lowermost). Net-Span 6::5 Amphidemon of Unscreened Matrix. Haunts Gt-15. 6th Phase-limit. Decadology. C/tp-#6, Mn- [6D]. Rt-1:[54187236] Zero-gravity. [+2 sub-Rt]. Rt-2:[56] Cut-outs (UFO cover-ups, Nephilim)." },
    { mesh: 21, name: "Puppo (The Pup)", details: "Break-Outs. Pitch Cth-2. Net-Span 7::0 Amphidemon of Larval Regression. 7th Door (Akasha) [Uranus], Cervical Decadology. C/tp-#8, Mj- [8S]. Rt-1:[71890] Dissolving into slime (masked horrors). Rt-2:[72541890] Chthonic swallowings. [+1 sub-Rt]." },
    { mesh: 22, name: "Bubbamu (Bubs)", details: "After Babylon. Pitch Cth-1. Net-Span 7::1 Cyclic Chronodemon of Relapse. Prowls Surge-Current. Haunts Gt-28. Decadology. C/tp-#1, Mn- [1D]. Rt-1:[187] Mn. Hypersea (marine life on land). Rt-2:[71] Aquassassins (Black-Atlantis). Rt-3:[72541] Mj. Seawalls (dry-time, taboo on menstruation)." },
    { mesh: 23, name: "Oddubb (Odba)", details: "Broken Mirror. Pitch Null Net-Span 7::2 Syzygetic Chronodemon of Swamp-Labyrinths (and blind-doubles). Feeds Hold-Current. Rt-0:[X]. Time loops, glamour and glosses." },
    { mesh: 24, name: "Pabbakis (Pabzix)", details: "Dabbler. Pitch Ana-1 Net-Span 7::3 Amphidemon of Interference (and fakery). Decadology. C/tp-#5, Mj+ [5C]. 2nd Decademon. Rt-1:[723] Batrachian mutations (and frog-plagues). Rt-2:[72563] Cans of worms (vermophobic hysteria, propagation by division). [+1 sub-Rt]." },
    { mesh: 25, name: "Ababbatok (Abracadabra)", details: "Regenerator. Pitch Ana-2 Net-Span 7::4 Cyclic Chronodemon of Suspended Decay. Shadows Hold-Current Decadology. C/tp-#2, Mj+ [2C]. Rt-1:[4187] Frankensteinian experimentation (reanimations, golems). Rt-2:[45187] Mn. Purifications, amphibious cycles (and healing of wounds). Rt-3:[7254] Mj. Sustenance (smoke visions)." },
    { mesh: 26, name: "Papatakoo (Pataku)", details: "Upholder. Pitch Cth-6 Net-Span 7::5 Cyclic Chronodemon of Calendric Time. Prowls Hold-Current Decadology. C/tp-#2, Mj- [2S]. Rt-1:[54187] Mn. Ultimate success (perseverance, blood sacrifice). [+1 sub-Rt]. Rt-2:[725] Mj. Rituals becoming nature." },
    { mesh: 27, name: "Bobobja (Bubbles, Beelzebub (Lord of the Flies))", details: "Heavy Atmosphere Pitch Cth-5 Net-Span 7::6 Amphidemon of Teeming Pestilence. 7th Phase-limit Decadology. C/tp-#5, Mj- [5S]. Rt-1:[7236] Strange lights in the swamp (dragonflies, ET frog-cults). [+1 sub-Rt]. Rt-2:[7256] Swarmachines (lost harvests)." },
    { mesh: 28, name: "Minommo", details: "Webmaker. Pitch Cth-1 Net-Span 8::0 Amphidemon of Submergance. 8th Door (Limbo) [Neptune] Lumbar Decadology. C/tp-#7, Mj- [7S]. Rt-1:[890] Shamanic voyage (dream sorcery and mitochondrial chatter)." },
    { mesh: 29, name: "Mur Mur (Murrumur, Mu(mu))", details: "Dream-Serpent. Pitch Null Net-Span 8::1 Syzygetic Chronodemon of the Deep Ones. Feeds Surge-Current. Rt-0:[X] Oceanic sensation (gilled-unlife and spinal-regressions)." },
    { mesh: 30, name: "Nammamad", details: "Mirroracle. Pitch Ana-1 Net-Span 8::2 Cyclic Chronodemon of Subterranean Commerce. Shadows Surge-Current.Ciphers Gt-28 Decadology. C/tp-#1, Mj+ [1C]. 3rd Decademon Rt-1:[2718] Voodoo in cyberspace (cthulhoid traffic). Rt-2:[275418] Mn. Completion as final collapse (heat-death, degenerative psychoses). [+1 sub-Rt]. Rt-3:[8172] Mj. Emergences (and things washed-up on beaches)." },
    { mesh: 31, name: "Mummumix (Mix-Up)", details: "The Mist-Crawler. Pitch Ana-2. Net-Span 8::3 Amphidemon of Insidious Fog (Nyarlathotep) Decadology. C/tp-#4, Mj+ [4C]. Rt-1:[81723] Ocean storms (and xenocommunication on the bacterial plane). Rt-2:[8172563] Diseases from outer-space (oankali medicine). [+1 sub-Rt]." },
    { mesh: 32, name: "Numko (Old Nuk)", details: "Keeper of Old Terrors. Pitch Ana-3. Net-Span 8::4 Cyclic Chronodemon of Autochthony. Prowls Sink-Current Decadology. C/tp-#3, Mn+ [3H]. Rt-1:[418] Necrospeleology (abysmal patience rewarded). Rt-2:[4518] Mn. Subduction (and carnivorous fish). Rt-3:[817254] Mj. Vulcanism (and bacterial intelligence)." },
    { mesh: 33, name: "Muntuk (Manta, Manitou)", details: "Desert Swimmer. Pitch Cth-5 Net-Span 8::5 Cyclic Chronodemon of Arid Seabeds. Shadows Sink-Current. Decadology. C/tp-#3, Mn- [3D]. Rt-1:[5418] Mn. Ancient rivers. [+1 sub-Rt]. Rt-2:[81725] Mj. Cloud-vaults and oppressive tension (protection during monsoon)" },
    { mesh: 34, name: "Mommoljo (Mama Jo)", details: "Alien Mother. Pitch Cth-4. Net-Span 8::6 Amphidemon of Xenogenesis Decadology. C/tp-#4, Mj- [4S]. Rt-1:[817236] Cosmobacterial exogermination. [+1 sub-Rt]. Rt-2:[817256] Extraterrestrial residues (including alien DNA segments)." },
    { mesh: 35, name: "Mombbo (Fishy-princess)", details: "Tentacle Face. Pitch Cth-3 Net-Span 8::7 Cyclic Chronodemon of Hybridity. Prowls Surge-Current 8th Phase-limit. Decadology. C/tp-#1, Mj- [1S]. Rt-1:[718] Ophidian transmutation (palaeopythons). Rt-2:[725418] Mn. Surreptitious colonization [+1 sub-Rt]. Rt-3:[817] Mj. Surface-amnesia (old fishwives tales)." },
    { mesh: 36, name: "Uttunul", details: "Seething Void (clicks Gt-36) Pitch Null Net-Span 9::0 Syzygetic Xenodemon of Atonality. Feeds and Prowls Plex-Current, Haunts Gt-45 9th Door (Cthelll) [Pluto], Sacrum Rt-0:[X] Crossing the iron-ocean (plutonics)" },
    { mesh: 37, name: "Tutagool (Yettuk)", details: "The Tattered Ghoul. Pitch Ana-1. Net-Span 9::1 Amphidemon of Punctuality. Decadology. C/tp-#7, Mn+ [7H]. 4th Decademon Rt-1:[189] The dark arts, rusting iron, tattooing (one-way ticket to Hell)." },
    { mesh: 38, name: "Unnunddo (The False Nun)", details: "Double-Undoing. Pitch Ana-2. Net-Span 9::2 Amphidemon of Endless Uncasing (onion-skin horror) Decadology. C/tp-#8, Mn+ [8H]. Rt-1:[27189] Crypt-traffic (and centipede simulations). Rt-2:[2754189] Communication-grids (telecom webs, shamanic metallism).[+1 sub-Rt]." },
    { mesh: 39, name: "Ununuttix (Tick-Tock)", details: "Particle Clocks. Pitch Ana-3 Net-Span 9::3 Chaotic Xenodemon of Absolute Coincidence Rt-0:[?] Numerical connection through the absence of any link" },
    { mesh: 40, name: "Ununak (Nuke)", details: "Blind Catastrophe. Pitch Ana-4. Net-Span 9::4 Amphidemon of Convulsions. Decadology. C/tp-#9, Mn+ [9H]. Rt-1:[4189] Secrets of the blacksmiths. Rt-2:[45189] Subterranean impulses." },
    { mesh: 41, name: "Tukutu (Killer-Kate)", details: "Cosmotraumatics. Pitch Cth-4 Net Span 9::5 Amphidemon of Death-Strokes. Decadology. C/tp-#9, Mn- [9D]. Rt-1:[54189] Crash-signals (barkerian scarring). [+1 sub-Rt]." },
    { mesh: 42, name: "Unnutchi (Outch, T'ai Chi)", details: "Tachyonic immobility (slow vortex). Pitch Cth-3. Net-Span 9::6 Chaotic Xenodemon of Coiling Outsideness. Rt-0:[?] Asymmetric zygopoise (and cybernetic anomalies)." },
    { mesh: 43, name: "Nuttubab (Nut-Cracker)", details: "Mimetic Anorganism. Pitch Cth-2 Net-Span 9::7 Amphidemon of Metaloid Unlife. Decadology. C/tp-#8, Mn- [8D]. Rt-1:[7189] Lunacies (iron in the blood). Rt-2:[7254189] Dragon-lines (terrestrial electromagnetism). [+1 sub-Rt]." },
    { mesh: 44, name: "Ummnu (Om, Omni, Amen, Omen)", details: "Ultimate Inconsequence. Pitch Cth-1 Net-Span 9::8 Amphidemon of Earth-Screams. Haunts Gt-36 9th Phase-limit Decadology. C/tp-#7, Mn- [7D]. Rt-0:[89] Crust-friction (anorganic tension)." },
  ];

  const initializeDeck = () => {
    const newDeck = [];

    if (gameMode === "actual-subdecadence") {
      // Generate 45 cards for Actual-Subdecadence
      for (let x = 1; x <= 9; x++) {
        for (let y = 0; y < x; y++) {
          const phaseNumber = x; // Highest number is the phase number
          const operationalNumber = 9 - phaseNumber; // 9 - phase number
          const netspan = `${x}::${y}`; // Combination string as suit

          newDeck.push({
            suit: netspan,
            value: operationalNumber,
            display: operationalNumber.toString(),
            id: netspan,
          });
        }
      }
    } else {
      // Original Subdecadence/Decadence deck generation
      suits.forEach((suit) => {
        const startValue = gameMode === "decadence" ? 1 : 0;
        for (let i = startValue; i <= 9; i++) {
          if (i === 0 && gameMode === "subdecadence") {
            newDeck.push({ suit, value: 0, display: "Q", id: `${suit}-0` });
          }
          if (i > 0) {
            newDeck.push({
              suit, value: i, display: i.toString(), id: `${suit}-${i}`,
            });
          }
        }
      });
    }
    // newDeck.push({ suit: '🃏', value: 'K', display: 'Joker', id: 'joker' });
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deckToShuffle) => {
    const shuffled = [...deckToShuffle];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startNewGame = () => {
    const newDeck = initializeDeck();
    setDeck(newDeck);
    setCrossCards([]);
    setSetCards([]);
    setFlippedCards(new Set());
    setSelectedMatchCard(null);
    setSelectedPairs([]);
    setCurrentScore(0);
    setScoreBreakdown(null);
    setAeonTotal(0);
    setAeonScores([]);
    setSummonedLemur(null);
    setGameState("idle");
    setMessage("Draw cards to begin the aeon");
  };

  const drawCards = () => {
    if (deck.length < 10) {
      setMessage("Not enough cards in deck");
      return;
    }

    const newCross = deck.slice(0, 5);
    const newSet = deck.slice(5, 10);
    const remainingDeck = deck.slice(10);

    setCrossCards(newCross);
    setSetCards(newSet);
    setDeck(remainingDeck);
    setFlippedCards(new Set());
    setSelectedMatchCard(null);
    setSelectedPairs([]);
    setScoreBreakdown(null);
    setGameState("playing");
    setMessage("Flip the matching set cards to reveal them");
  };

  const flipCard = (cardId) => {
    const newFlipped = new Set(flippedCards);
    newFlipped.add(cardId);
    setFlippedCards(newFlipped);
  };

  const flipAllCards = () => {
    const newFlipped = new Set(setCards.map((c) => c.id));
    setFlippedCards(newFlipped);
    setMessage("Select cards to pair or click Calculate to auto-match");
  };

  const canPair = (card1, card2) => {
    if (card1.value === "K" || card2.value === "K") return false;
    const target = gameMode === "decadence" ? 10 : 9; // Decadence targets 10, others target 9
    return card1.value + card2.value === target;
  };

  const selectMatchCard = (card) => {
    if (!flippedCards.has(card.id)) return;

    // toggle selection
    if (selectedMatchCard?.id === card.id) {
      setSelectedMatchCard(null);
    } else {
      setSelectedMatchCard(card);
    }
  };

  const handleCrossCardClick = (crossCard) => {
    if (!selectedMatchCard) return;
    if (!canPair(crossCard, selectedMatchCard)) return;

    pairCards(crossCard, selectedMatchCard);
    setSelectedMatchCard(null);
  };

  const pairCards = (crossCard, setCard) => {
    const pairKey = `${crossCard.id}-${setCard.id}`;
    const existingPairIndex = selectedPairs.findIndex((p) => p.key === pairKey);

    if (existingPairIndex >= 0) {
      setSelectedPairs(selectedPairs.filter((_, i) => i !== existingPairIndex));
    } else {
      const filtered = selectedPairs.filter(
        (p) => p.crossCard.id !== crossCard.id && p.setCard.id !== setCard.id
      );
      filtered.push({ crossCard, setCard, key: pairKey });
      setSelectedPairs(filtered);
    }
  };

  const handleMouseDown = (e, card, index) => {
    if (!flippedCards.has(card.id)) return;

    selectMatchCard(card);

    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggedCardIndex(index);

    setDraggedCard(card);
    setDragOffset({ x: offsetX, y: offsetY });
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsDragging(true);

    // Remove the card from setCards while dragging
    setSetCards((prev) => filterDraggedCard(prev, card.id));
  };

  const filterDraggedCard = (cards, draggedId) => {
    return cards.filter((card) => card.id !== draggedId);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const crossCardElement = elements.find((el) => el.dataset.crosscard);

    if (crossCardElement && draggedCard) {
      const crossCardId = crossCardElement.dataset.crosscard;
      const targetCard = crossCards.find((c) => c.id === crossCardId);

      if (canPair(targetCard, draggedCard)) {
        pairCards(targetCard, draggedCard);
      } else {
        // Return card to its original position if not paired
        setSetCards((prev) => {
          const newSet = [...prev];
          newSet.splice(draggedCardIndex, 0, draggedCard);
          return newSet;
        });
      }
    } else {
      // Return card to its original position if dropped outside a cross card
      setSetCards((prev) => {
        const newSet = [...prev];
        newSet.splice(draggedCardIndex, 0, draggedCard);
        return newSet;
      });
    }

    setIsDragging(false);
    setDraggedCard(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  const autoMatchPairs = () => {
    const pairedCrossIds = new Set(selectedPairs.map((p) => p.crossCard.id));
    const pairedSetIds = new Set(selectedPairs.map((p) => p.setCard.id));

    const availableCross = crossCards.filter((c) => !pairedCrossIds.has(c.id));
    const availableSet = setCards.filter((c) => !pairedSetIds.has(c.id));

    const newPairs = [...selectedPairs];

    for (const crossCard of availableCross) {
      for (const setCard of availableSet) {
        if (
          canPair(crossCard, setCard) &&
          !newPairs.some((p) => p.setCard.id === setCard.id)
        ) {
          newPairs.push({
            crossCard,
            setCard,
            key: `${crossCard.id}-${setCard.id}`,
          });
          break;
        }
      }
    }

    setSelectedPairs(newPairs);
  };

  const calculateScore = () => {
    if (gameState !== "playing") return;

    // First auto-match any possible pairs
    const pairedCrossIds = new Set(selectedPairs.map((p) => p.crossCard.id));
    const pairedSetIds = new Set(selectedPairs.map((p) => p.setCard.id));

    const availableCross = crossCards.filter((c) => !pairedCrossIds.has(c.id));
    const availableSet = setCards.filter((c) => !pairedSetIds.has(c.id));

    const newPairs = [...selectedPairs];

    // Find new pairs
    for (const crossCard of availableCross) {
      for (const setCard of availableSet) {
        if (
          canPair(crossCard, setCard) &&
          !newPairs.some((p) => p.setCard.id === setCard.id)
        ) {
          newPairs.push({
            crossCard,
            setCard,
            key: `${crossCard.id}-${setCard.id}`,
          });
          break;
        }
      }
    }

    // Calculate score using all pairs including new ones
    const finalCrossIds = new Set(newPairs.map((p) => p.crossCard.id));
    const unpairedCross = crossCards.filter((c) => !finalCrossIds.has(c.id));

    const pairScores = [];
    let score = 0;

    const unpairedScores = [];
    unpairedCross.forEach((card) => {
      if (card.value !== "K") {
        score -= card.value;
        unpairedScores.push({
          card: card,
          value: card.value,
          positive: false,
        });
      }
    });

    newPairs.forEach((pair) => {
      const diff = Math.abs(pair.crossCard.value - pair.setCard.value);
      score += diff;
      pairScores.push({
        crossCard: pair.crossCard,
        setCard: pair.setCard,
        diff: diff,
        positive: true,
      });
    });

    // Update all states at once
    setSelectedPairs(newPairs);
    setScoreBreakdown({
      pairs: pairScores,
      unpaired: unpairedScores,
      total: score,
    });
    setCurrentScore(score);
    setAeonTotal(aeonTotal + score);
    setAeonScores((prevScores) => [...prevScores, score]);

    const finalScore = aeonTotal + score;
    const lemurMesh = Math.abs(finalScore);
    const lemur = lemurs.find((l) => l.mesh === lemurMesh);

    // Set game state and message
    if (score < 0 || deck.length < 10) {
      setSummonedLemur(lemur);
      setGameState("ended");
      setMessage(
        score < 0
          ? `Game ended. Final score: ${finalScore}. Call the lemur at mesh ${lemurMesh}`
          : `Deck out! Final score: ${finalScore}. Call the lemur at mesh ${lemurMesh}`
      );
    } else {
      setGameState("idle");
      setMessage(`Score: +${score}. Draw again to continue.`);
    }
  };




  useEffect(() => {
    startNewGame();
  }, [gameMode]);

  useEffect(() => {
    startNewGame();
  }, []);

  const Card = ({
    card,
    position,
    onClick,
    isHighlighted,
    isPaired,
    isFlipped,
    faceDown,
    isDraggable,
    isStacked,
    isSelected,
    shouldGlow,
    isBottom,
  }) => {
    const [isFlipping, setIsFlipping] = useState(false);

    const handleClick = () => {
      if (faceDown && !isFlipped) {
        setIsFlipping(true);
        setTimeout(() => {
          flipCard(card.id);
          setIsFlipping(false);
        }, 300);
      } else if (onClick) {
        onClick();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        onClick={handleClick}
        onMouseDown={(e) => onClick && onClick(e)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        className={`
          select-none
          ${isStacked ? "absolute inset-0" : "relative"} 
          w-20 h-28 rounded-lg flex items-center justify-center
          ${
            isDraggable && isFlipped
              ? "cursor-move"
              : onClick
              ? "cursor-pointer"
              : "cursor-default"
          }
          transition-all transform 
          ${!isStacked && "hover:scale-105"}
          ${faceDown && !isFlipped ? "hover:brightness-110" : ""}
          ${isFlipping ? "animate-flip" : ""}
          ${isSelected ? "ring-4 ring-yellow-400 scale-110" : ""}
          ${shouldGlow ? "ring-4 ring-green-400 animate-pulse" : ""}
        `}
        style={{
          transformStyle: "preserve-3d",
          transition: isFlipping ? "transform 0.6s" : "transform 0.2s",
          transform: isFlipping ? "rotateY(180deg)" : "rotateY(0deg)",
          zIndex: isStacked ? (isBottom ? 1 : 2) : isSelected ? 10 : 1,
        }}
      >
        {faceDown && !isFlipped ? (
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-lg border-2 border-purple-400 flex items-center justify-center backface-hidden select-none">
            <div className="text-4xl opacity-50">🃏</div>
          </div>
        ) : (
          <div
            className={`
              select-none
              absolute inset-0 rounded-lg flex flex-col items-center justify-center
              ${
                isPaired
                  ? "bg-green-600 text-white"
                  : isHighlighted
                  ? "bg-yellow-500"
                  : "bg-white"
              }
              ${
                gameMode === "subdecadence" &&
                (card.suit === "♥" || card.suit === "♦")
                  ? "text-red-600"
                  : "text-black"
              }
              border-2 ${isPaired ? "border-green-700" : "border-gray-300"}
              shadow-md hover:shadow-lg backface-hidden
            `}
          >
            <div className="absolute top-1 left-1 w-4 text-xs font-bold flex flex-col items-center">
              <span>{card.display}</span>
              <span className="text-[0.6rem]">{card.suit}</span> {/* Smaller font for netspan */}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">{card.display}</div>
            </div>
            <div className="absolute bottom-1 right-1 w-4 text-xs font-bold flex flex-col items-center rotate-180">
              <span>{card.display}</span>
              <span className="text-[0.6rem]">{card.suit}</span> {/* Smaller font for netspan */}
            </div>

            {position && (
              <div className="absolute -top-6 text-xs font-semibold text-gray-600 whitespace-nowrap">
                {position}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const isPaired = (cardId) =>
    selectedPairs.some(
      (p) => p.crossCard.id === cardId || p.setCard.id === cardId
    );

  const getPairedSetCard = (crossCardId) => {
    const pair = selectedPairs.find((p) => p.crossCard.id === crossCardId);
    return pair?.setCard;
  };

  const allFlipped =
    setCards.length > 0 && setCards.every((card) => flippedCards.has(card.id));

  useEffect(() => {
    if (allFlipped && gameState === "playing") {
      setMessage("Select cards to pair or click Calculate to auto-match");
    }
  }, [allFlipped, gameState]);

  const getGlowingCrossCards = () => {
    if (!selectedMatchCard) return new Set();
    return new Set(
      crossCards
        .filter(
          (crossCard) =>
            canPair(crossCard, selectedMatchCard) && !isPaired(crossCard.id)
        )
        .map((card) => card.id)
    );
  };

  const glowingCards = getGlowingCrossCards();

  const CrossCardWithPair = ({ card, position, positionStyle }) => {
    const pairedSetCard = getPairedSetCard(card.id);
    const shouldGlow = glowingCards.has(card.id);

    return (
      <div className="absolute" style={positionStyle}>
        <div className="relative w-20 h-28" data-crosscard={card.id}>
          <Card
            card={card}
            position={position}
            onClick={() => handleCrossCardClick(card)}
            isPaired={isPaired(card.id)}
            isFlipped={true}
            shouldGlow={shouldGlow}
            isStacked={!!pairedSetCard}
            isBottom={true}
          />
          {pairedSetCard && (
            <div className="absolute top-1 left-6" style={{ zIndex: 2 }}>
              <Card
                card={pairedSetCard}
                isPaired={true}
                isFlipped={true}
                isStacked={false}
                isBottom={false}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const hasDrawnCards = crossCards.length > 0;

  const targetNumber = gameMode === "decadence" ? 10 : 9;

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
      {draggedCard && isDragging && (
        <div
          className="pointer-events-none fixed"
          style={{
            left: mousePosition.x - dragOffset.x,
            top: mousePosition.y - dragOffset.y,
            zIndex: 1000,
          }}
        >
          <Card
            card={draggedCard}
            isFlipped={true}
            isDraggable={false}
            isPaired={false}
            isSelected={selectedMatchCard?.id === draggedCard?.id}
          />
        </div>
      )}

      <div className="h-full flex flex-col md:flex-row">
        {/* Left column: Score + Help*/}

        <aside className="w-full md:w-96 bg-transparent p-4 flex-shrink-0 overflow-auto">
          {gameState === "playing" && (
            <div className="mt-3 bg-black bg-opacity-50 rounded-lg p-4 mb-4">
              <h2 className="text-lg font-semibold mb-2">How to Play</h2>
              <p className="text-sm text-gray-300">
                Pair cards that sum to {targetNumber}. Select a flipped set card
                and drop it on a cross card, or use Calculate to auto-match.
              </p>
            </div>
          )}

          {gameState === "ended" && summonedLemur && (
            <div className="mt-3 bg-black bg-opacity-50 rounded-lg p-4">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2 text-center">
                Lemur Summoned
              </h2>
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                Mesh-{summonedLemur.mesh}: {summonedLemur.name}
              </h3>
              <p className="text-gray-300">{summonedLemur.details}</p>

              <div className="mt-4 border-t border-gray-700 pt-4">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                  Aeon Scores
                </h3>
                <ul className="space-y-1 text-sm text-gray-400">
                  {aeonScores.map((roundScore, index) => (
                    <li key={index} className="flex justify-between">
                      <span>Round {index + 1}:</span>
                      <span
                        className={
                          roundScore >= 0 ? "text-green-400" : "text-red-400"
                        }
                      >
                        {roundScore >= 0 ? "+" : ""}
                        {roundScore}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {gameState !== "ended" && scoreBreakdown && (
            <div className="mt-3 bg-black bg-opacity-50 rounded-lg p-4">
              <h2 className="text-2xl font-bold mb-4 text-center">
                Score Calculation
              </h2>
              {/* reuse existing score breakdown rendering */}
              {scoreBreakdown.pairs.length > -1 && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-3 text-green-400">
                    Paired Cards (Positive)
                  </h3>
                  <div className="space-y-3">
                    {scoreBreakdown.pairs.map((pair, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-gray-800 rounded p-3"
                      >
                        <div
                          className={`w-13 h-16 rounded flex items-center justify-center text-sm font-bold ${
                            pair.crossCard.suit === "♥" ||
                            pair.crossCard.suit === "♦"
                              ? "bg-red-600"
                              : "bg-gray-700"
                          }`}
                        >
                          {pair.crossCard.display}
                        </div>
                        <span className="text-3xl">+</span>
                        <div
                          className={`w-13 h-16 rounded flex items-center justify-center text-sm font-bold ${
                            pair.setCard.suit === "♥" ||
                            pair.setCard.suit === "♦"
                              ? "bg-red-600"
                              : "bg-gray-700"
                          }`}
                        >
                          {pair.setCard.display}
                        </div>
                        <span className="text-xl">=</span>
                        <span className="text-xl font-bold">8</span>
                        <span className="flex-shrink-0 text-right text-gray-400">
                          |{pair.crossCard.value} - {pair.setCard.value}|
                        </span>
                        <span className="text-3xl font-bold text-green-400">
                          +{pair.diff}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scoreBreakdown.unpaired.length > -1 && (
                <div className="mb-5">
                  <h3 className="text-lg font-semibold mb-3 text-red-400">
                    Unpaired Cards (Negative)
                  </h3>
                  <div className="space-y-3">
                    {scoreBreakdown.unpaired.map((unpaired, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-gray-800 rounded p-3"
                      >
                        <div
                          className={`w-13 h-16 rounded flex items-center justify-center text-sm font-bold ${
                            unpaired.card.suit === "♥" ||
                            unpaired.card.suit === "♦"
                              ? "bg-red-600"
                              : "bg-gray-700"
                          }`}
                        >
                          {unpaired.card.display}
                        </div>
                        <span className="flex-2 text-gray-400">
                          No pair found
                        </span>
                        <span className="text-3xl font-bold text-red-400">
                          -{unpaired.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t-3 border-gray-600 pt-4">
                <div className="flex items-center justify-between text-3xl font-bold">
                  <span>Total Score:</span>
                  <span
                    className={
                      scoreBreakdown.total >= -1
                        ? "text-green-400"
                        : scoreBreakdown.total === 0
                        ? "text-gray-400"
                        : "text-red-400"
                    }
                  >
                    {scoreBreakdown.total > 0 ? "+" : ""}
                    {scoreBreakdown.total}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
        {/* Center column: title + cards */}
        <main className="flex-1 flex flex-col items-center px-4 py-1">
          <div className="w-full max-w-4xl flex flex-col flex-1">
            <header className="shrink-0 text-center">
              <h1 className="text-4xl font-bold mb-2 capitalize">{gameMode}</h1>
              <p className="text-center text-gray-300 mb-2">
                {gameMode === "decadence"
                  ? "UNO™ is the perfect time Time Sorcery tool..." // Decadence description
                  : gameMode === "actual-subdecadence"
                  ? "The ultimater blasphemy; xeno sorcerers' delight"
                  : "The Ultimate Blasphemy"}
              </p>

              <div className="bg-black bg-opacity-50 rounded-lg p-2">
                <div className="flex justify-between text-center">
                  <div>
                    <div className="text-sm text-gray-400">Current Score</div>
                    <div
                      className={`text-3xl font-bold ${
                        currentScore >= 0
                          ? currentScore == 0
                            ? "text-grey-400"
                            : "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {currentScore > 0 ? "+" : ""}
                      {currentScore}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Aeon Total</div>
                    <div
                      className={`text-3xl font-bold ${
                        aeonTotal >= 0
                          ? aeonTotal == 0
                            ? "text-grey-400"
                            : "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {aeonTotal > 0 ? "+" : ""}
                      {aeonTotal}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Cards Left</div>
                    <div className="text-3xl font-bold text-blue-400">
                      {deck.length}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">{message}</div>
              </div>
            </header>

            {/* Cards area — make this the only scrollable portion */}
            <div className="flex-1 mt-2">
              {hasDrawnCards && (
                <div className="flex gap-2 justify-center w-full h-full">
                  {/* Matching Set */}
                  <div className="w-1/3">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                      Matching Set
                    </h2>
                    <div className="flex flex-col gap-2 items-center justify-center min-h-[1px]">
                      {setCards.map(
                        (card, index) =>
                          !isPaired(card.id) && (
                            <Card
                              key={card.id}
                              card={card}
                              isPaired={false}
                              isFlipped={flippedCards.has(card.id)}
                              faceDown={true}
                              onClick={
                                flippedCards.has(card.id)
                                  ? (e) => {
                                      // handle both real mouse-down events (from Card.onMouseDown)
                                      // and click/keyboard activations (where e may be undefined)
                                      if (e?.type === "mousedown") {
                                        handleMouseDown(e, card, index);
                                      } else {
                                        selectMatchCard(card);
                                      }
                                    }
                                  : null
                              }
                              isDraggable={flippedCards.has(card.id)}
                              isSelected={selectedMatchCard?.id === card.id}
                            />
                          )
                      )}
                    </div>
                  </div>

                  {/* Atlantean Cross */}
                  <div className="w-2/3 flex flex-col">
                    <h2 className="text-xl font-semibold text-center">
                      Atlantean Cross
                    </h2>
                    <div className="flex-1 flex justify-center pt-6">
                      <div className="relative flex justify-center items-center min-w-[320px] min-h-[500px] overflow-visible">
                        <CrossCardWithPair
                          card={crossCards[0]}
                          position="Deep Past"
                          positionStyle={{
                            top: "280px",
                            left: "50%",
                            transform: "translate(-50%, 0)",
                          }}
                        />
                        <CrossCardWithPair
                          card={crossCards[1]}
                          position="Creative"
                          positionStyle={{
                            top: "140px",
                            right: "20%",
                            transform: "translate(50%, 0)",
                          }}
                        />
                        <CrossCardWithPair
                          card={crossCards[2]}
                          position="Destructive"
                          positionStyle={{
                            top: "140px",
                            left: "20%",
                            transform: "translate(-50%, 0)",
                          }}
                        />
                        <CrossCardWithPair
                          card={crossCards[3]}
                          position="Far Future"
                          positionStyle={{
                            top: "0",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        />
                        <CrossCardWithPair
                          card={crossCards[4]}
                          position="Dreams"
                          positionStyle={{
                            top: "420px",
                            left: "50%",
                            transform: "translateX(-50%)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right column: Controls */}
        <aside
          className={`w-full md:w-56 bg-transparent py-4 pr-4 flex-shrink-0 h-screen transition-opacity duration-1000 ${
            gameState === "ended" ? "z-60 opacity-100" : "opacity-100"
          }`}
        >
          <div className="h-full flex flex-col justify-center">
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="gameMode"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Game Mode
                </label>
                <select
                  id="gameMode"
                  value={gameMode}
                  onChange={(e) => setGameMode(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 text-white px-3 py-2 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="subdecadence">Subdecadence</option>
                  <option value="decadence">Decadence</option>
                  <option value="actual-subdecadence">
                    Actual-Subdecadence
                  </option>
                </select>
              </div>
              <button
                onClick={startNewGame}
                className="w-full flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                <RotateCcw size={18} />
                New Game
              </button>

              {gameState !== "playing" ? (
                <button
                  onClick={drawCards}
                  disabled={gameState === "ended" || deck.length < 10}
                  className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Shuffle size={18} />
                  Draw Cards
                </button>
              ) : (
                <button
                  onClick={flipAllCards}
                  disabled={allFlipped}
                  className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye size={18} />
                  Flip All
                </button>
              )}

              <button
                onClick={calculateScore}
                disabled={gameState !== "playing" || !allFlipped}
                className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play size={18} />
                Calculate Score
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Subdecadence;
