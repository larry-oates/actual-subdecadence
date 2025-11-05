import React, { useState, useEffect } from "react";
import { Shuffle, Play, RotateCcw, Eye } from "lucide-react";

const Subdecadence = () => {
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
  const [gameState, setGameState] = useState("idle");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const suits = ["♥", "♦", "♣", "♠"];

  const initializeDeck = () => {
    const newDeck = [];
    suits.forEach((suit) => {
      for (let i = 0; i <= 9; i++) {
        if (i === 0) {
          newDeck.push({ suit, value: 0, display: "Q", id: `${suit}-0` });
        } else {
          newDeck.push({
            suit,
            value: i,
            display: i.toString(),
            id: `${suit}-${i}`,
          });
        }
      }
    });
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
    return card1.value + card2.value === 9;
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

    // Set game state and message
    if (score < 0) {
      setGameState("ended");
      setMessage(
        `Game ended. Final score: ${
          aeonTotal + score
        }. Call the lemur at mesh ${Math.abs(aeonTotal + score)}`
      );
    } else if (deck.length < 10) {
      setGameState("ended");
      setMessage(
        `Deck out! Final score: ${
          aeonTotal + score
        }. Call the lemur at mesh ${Math.abs(aeonTotal + score)}`
      );
    } else {
      setGameState("idle");
      setMessage(`Score: +${score}. Draw again to continue.`);
    }
  };

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
                card.suit === "♥" || card.suit === "♦"
                  ? "text-red-600"
                  : "text-black"
              }
              border-2 ${isPaired ? "border-green-700" : "border-gray-300"}
              shadow-md hover:shadow-lg backface-hidden
            `}
          >
            <div className="absolute top-1 left-1 w-4 text-xs font-bold flex flex-col items-center">
              <span>{card.display}</span>
              <span>{card.suit}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold">{card.display}</div>
            </div>
            <div className="absolute bottom-1 right-1 w-4 text-xs font-bold flex flex-col items-center rotate-180">
              <span>{card.display}</span>
              <span>{card.suit}</span>
            </div>

            {position && !isStacked && (
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
            <div className="absolute top-5 left-5" style={{ zIndex: 2 }}>
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

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
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
              <p className="text-sm text-gray-301">
                Select a flipped set card and drop it on a cross card, or use
                Calculate to auto-match.
              </p>
            </div>
          )}

          {scoreBreakdown && (
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
                        : "text-red-400"
                    }
                  >
                    {scoreBreakdown.total >= -1 ? "+" : ""}
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
            <header className="shrink-0">
              <h1 className="text-4xl font-bold text-center mb-2">Subdecadence</h1>
              <p className="text-center text-gray-300 mb-2">
                UNO™ is the perfect time Time Sorcery tool...
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
            <div className="flex-1 overflow-auto mt-2">
              {hasDrawnCards && (
                <div className="flex gap-2 justify-center w-full">
                  {/* Matching Set */}
                  <div className="w-1/3">
                    <h2 className="text-xl font-semibold mb-2 text-center">
                      Matching Set
                    </h2>
                    <div className="flex flex-col gap-2 items-center">
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
                    <div className="flex-1 flex justify-center items-center">
                      <div className="relative flex justify-center items-center min-w-[320px] min-h-[500px] overflow-visible">
                        <CrossCardWithPair card={crossCards[0]} position="Deep Past" positionStyle={{ top: "280px", left: "50%", transform: "translate(-50%, 0)" }} />
                        <CrossCardWithPair card={crossCards[1]} position="Creative" positionStyle={{ top: "140px", right: "20%", transform: "translate(50%, 0)" }} />
                        <CrossCardWithPair card={crossCards[2]} position="Destructive" positionStyle={{ top: "140px", left: "20%", transform: "translate(-50%, 0)" }} />
                        <CrossCardWithPair card={crossCards[3]} position="Far Future" positionStyle={{ top: "0", left: "50%", transform: "translateX(-50%)" }} />
                        <CrossCardWithPair card={crossCards[4]} position="Dreams" positionStyle={{ top: "420px", left: "50%", transform: "translateX(-50%)" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Right column: Controls */}
        <aside className="w-full md:w-56 bg-transparent p-4 flex-shrink-0 h-screen">
          <div className="h-full flex flex-col justify-center">
            <div className="flex flex-col gap-4">
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
