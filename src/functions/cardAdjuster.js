function adjustCard(correctCard) {
    const thingsThatCanBeWrong = ["cost", "health", "attack", "gem", "text", "race"]
    // const thingsThatCanBeWrong = ["race"]

    const randI = Math.floor(Math.random() * (thingsThatCanBeWrong.length))

    if (thingsThatCanBeWrong[randI] === "cost") {
        return adjustCost(correctCard)
    }
    else if (thingsThatCanBeWrong[randI] === "health") {
        return adjustHealth(correctCard)
    }
    else if (thingsThatCanBeWrong[randI] === "attack") {
        return adjustAttack(correctCard)
    }
    else if (thingsThatCanBeWrong[randI] === "gem") {
        return adjustGem(correctCard)
    }
    else if (thingsThatCanBeWrong[randI] === "text") {
        return adjustText(correctCard)
    }
    else if (thingsThatCanBeWrong[randI] === "race") {
        return adjustRace(correctCard)
    }

    console.error("Card not adjusted")
}

function adjustCost(card) {
    const newCard = card
    const randI = Math.floor(Math.random() * (2))
    if (randI === 0 || newCard.cost === 0) {
        newCard.cost = newCard.cost + 1
    }
    else {
        newCard.cost = newCard.cost - 1
    }
    newCard.wrong = 'cost'
    return newCard
}

function adjustHealth(card) {
    const newCard = card
    const randI = Math.floor(Math.random() * (2))
    if (randI === 0 || newCard.health === 1) {
        newCard.health = newCard.health + 1
    }
    else {
        newCard.health = newCard.health - 1
    }
    newCard.wrong = 'health'
    return newCard
}

function adjustAttack(card) {
    const newCard = card
    const randI = Math.floor(Math.random() * (2))
    if (randI === 0 || newCard.attack === 0) {
        newCard.attack = newCard.attack + 1
    }
    else {
        newCard.attack = newCard.attack - 1
    }
    newCard.wrong = 'attack'
    return newCard
}

function adjustGem(card) {
    const newCard = card
    const currentRarity = card.rarity
    const rarities = ["COMMON", "RARE", "EPIC", "LEGENDARY"]
    let randomRarity = currentRarity
    while (randomRarity === currentRarity) {
        const randI = Math.floor(Math.random() * (rarities.length))
        randomRarity = rarities[randI]
    }
    newCard.rarity = randomRarity
    newCard.wrong = 'gem'
    return newCard
}

function adjustText(card) {
    const newCard = card
    
    const possibleChanges = []
    const solitaryKeyWords = ["<b>Rush</b>", "<b>Charge</b>", "<b>Tradeable</b>", "<b>Taunt</b>", "<b>Divine Shield</b>", "<b>Stealth</b>", 
                              "<b>Windfury</b>", "<b>Poisonous</b>", "<b>Elusive</b>", "<b>Gigantify</b>"]
    const dependentKeyWords = ["<b>Battlecry:</b>", "<b>Deathrattle:</b>", "<b>Outcast:</b>", "<b>Combo:</b>", "<b>Spellburst:</b>", "<b>Finale:</b>", "<b>Quickdraw:</b>"]
    const handKeyWords = ["<b>Corrupt:</b>", "<b>Finale:</b>", "<b>Quickdraw:</b>", "<b>Forge:</b>"]
    const outdatedKillWords = ["<b>Frenzy:</b>", "<b>Overkill:</b>", "<b>Honorable Kill:</b>"]

    // in case we roll to adjust text with a card with no text
    if (!card.text || card.text.length === 1) {
        const randI = Math.floor(Math.random() * (solitaryKeyWords.length))
        newCard.text = solitaryKeyWords[randI]
        newCard.wrong = 'text'
        return newCard
    }

    newCard.text = card.text.replace("[x]", "").trim().replace("$", "").trim().replace("#", "").trim().replace("\\n", "<br />").trim()
    if (card.collectionText) {
        newCard.text = newCard.collectionText.replace("[x]", "").trim().replace("$", "").trim().replace("#", "").trim().replace("\\n", "<br />").trim()
    }

    // if is a mech but not have magnetic
    if (card.race === "MECHANICAL" && !card.text.includes("Magnetic")) {
        possibleChanges.push({choice: "addMagnetic", current: null})
    }

    const words = newCard.text.split(' ')
    for (const word of words) {
        if (solitaryKeyWords.includes(word) && !possibleChanges.includes("changeSolitaryKeyWord")) {
            possibleChanges.push({choice: "changeSolitaryKeyWord", current: word})
        }
        if (solitaryKeyWords.includes(word) && !possibleChanges.includes("removeSolitaryKeyWord")) {
            possibleChanges.push({choice: "removeSolitaryKeyWord", current: word})
        }
        else if (!isNaN(parseFloat(word)) && !isNaN(word - 0) && !possibleChanges.includes("changeNumber")) {
            possibleChanges.push({choice: "changeNumber", current: word})
        }
        else if (dependentKeyWords.includes(word) && !possibleChanges.includes("changeDependentKeyWord")) {
            possibleChanges.push({choice: "changeDependentKeyWord", current: word})
        }
        else if (handKeyWords.includes(word) && !possibleChanges.includes("changeHandKeyWord")) {
            possibleChanges.push({choice: "changeHandKeyWord", current: word})
        }

        const bigDudeRegex = /\b(?:\w*Titan\w*|\w*colossal\w*)\b/i
        if (bigDudeRegex.test(word) && !possibleChanges.includes("changeBigDude")) {
            possibleChanges.push({choice: "changeBigDude", current: word})
        }
        else if (outdatedKillWords.includes(word) && !possibleChanges.includes("changeOutdatedKillWord")) {
            possibleChanges.push({choice: "changeOutdatedKillWord", current: word})
        }
    }

    if (possibleChanges.length === 0) {
        return adjustCost(card)
    }

    const randI = Math.floor(Math.random() * (possibleChanges.length))
    const randomTextAdjustmentChoice = possibleChanges[randI].choice
    const currentWord = possibleChanges[randI].current

    if (randomTextAdjustmentChoice === "addMagnetic") {
        newCard.text = "<b>Magnetic</b>\n" + newCard.text
    }
    else if (randomTextAdjustmentChoice === "changeSolitaryKeyWord") {
        let chosenSolitaryKeyWord = currentWord
        while (chosenSolitaryKeyWord === currentWord) {
            const randI = Math.floor(Math.random() * (solitaryKeyWords.length))
            chosenSolitaryKeyWord = solitaryKeyWords[randI]
        }
        newCard.text = newCard.text.replace(currentWord, chosenSolitaryKeyWord)
    }
    else if (randomTextAdjustmentChoice === "removeSolitaryKeyWord") {
        newCard.text = newCard.text.replace(currentWord, "")
    }
    else if (randomTextAdjustmentChoice === "changeNumber") {
        let chosenNumber = currentWord
        const randI = Math.floor(Math.random() * (2))
        const hasPlusSign = currentWord.charAt(0) === "+"

        let newNumber
        if (randI === 0 || Number(chosenNumber) === 1) {
            newNumber = Number(chosenNumber) + 1
        }
        else {
            newNumber = Number(chosenNumber) - 1
        }

        newCard.text = hasPlusSign ? newCard.text.replace(chosenNumber, `+${newNumber}`) : newCard.text.replace(chosenNumber, newNumber)
    }
    else if (randomTextAdjustmentChoice === "changeDependentKeyWord") {
        let chosenDependentKeyWord = currentWord
        while (chosenDependentKeyWord === currentWord) {
            const randI = Math.floor(Math.random() * (dependentKeyWords.length))
            chosenDependentKeyWord = dependentKeyWords[randI]
        }
        newCard.text = newCard.text.replace(currentWord, chosenDependentKeyWord)
    }
    else if (randomTextAdjustmentChoice === "changeHandKeyWord") {
        let chosenHandKeyWord = currentWord
        while (chosenHandKeyWord === currentWord) {
            const randI = Math.floor(Math.random() * (handKeyWords.length))
            chosenHandKeyWord = handKeyWords[randI]
        }
        newCard.text = newCard.text.replace(currentWord, chosenHandKeyWord)
    }
    else if (randomTextAdjustmentChoice === "changeBigDude") {

        let bigDudeRegex = /\b(?:\w*Titan\w*|\w*colossal\w*)\b/i

        let chosenBigDudeWord = currentWord.match(bigDudeRegex)[0] === "Titan" ? `Colossal` : "Titan"
        if (chosenBigDudeWord === "Colossal") {
            const rng = Math.floor(Math.random() * (2)) === 0 ? 1 : 2
            chosenBigDudeWord = `Colossal +${rng}`
        }
        else if (chosenBigDudeWord === "Titan") {
            bigDudeRegex = /Colossal \+\d+/i
        }

        newCard.text = newCard.text.replace(bigDudeRegex, chosenBigDudeWord)
    }
    else if (randomTextAdjustmentChoice === "changeOutdatedKillWord") {
        let chosenOutdatedKillWord = currentWord
        while (chosenOutdatedKillWord === currentWord) {
            const randI = Math.floor(Math.random() * (outdatedKillWords.length))
            chosenOutdatedKillWord = outdatedKillWords[randI]
        }
        newCard.text = newCard.text.replace(currentWord, chosenOutdatedKillWord)
    }

    if (card.collectionText) {
        newCard.collectionText = newCard.text
    }


    newCard.wrong = 'text'
    return newCard

}

function adjustRace(card) {
    const newCard = card
    const races = ["BEAST", "DEMON", "DRAENEI", "DRAGON", "ELEMENTAL", "MECHANICAL", 
                   "MURLOC", "NAGA", "PIRATE", "QUILBOAR", "TOTEM", "UNDEAD"]
    
    // If no race
    if (!card.races) {
        const randI = Math.floor(Math.random() * (races.length))
        newCard.races = [races[randI]]
        newCard.wrong = 'race'
        return newCard
    }

    else if (card.races.length === 1) {
        const currentRaceArray = card.races
        let randomRace = currentRaceArray[0]
        while(currentRaceArray[0] == randomRace) {
            const randI = Math.floor(Math.random() * (races.length))
            randomRace = races[randI]
        }
        newCard.races[0] = randomRace
        newCard.wrong = 'race'
        return newCard
    }

    else if (card.races.length === 2) {
        const currentRaceArray = card.races
        const deleteRng = Math.floor(Math.random() * (2)) === 0 ? true : false

        if (deleteRng) {
            const randomIndex = Math.floor(Math.random() * (2))
            newCard.races.splice(randomIndex, 1)
        }
        else {
            const randomIndex = Math.floor(Math.random() * (2))
            let randomRace = currentRaceArray[randomIndex]
            while(currentRaceArray[randomIndex] == randomRace) {
                const randI = Math.floor(Math.random() * (races.length))
                randomRace = races[randI]
            }
            newCard.races[randomIndex] = randomRace
        }
    
        newCard.wrong = 'race'
        return newCard
    }

}

export default adjustCard