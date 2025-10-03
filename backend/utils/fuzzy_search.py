from fuzzywuzzy import fuzz

def fuzz_search(word, wordList, compareElement="description"):
    grade = 0
    match = None

    for element in wordList:
        score = fuzz.ratio(word, element.get(compareElement, "").lower())
        if score > grade:
            grade = score
            match = element
    
    return [grade, match]
