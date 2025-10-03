from fuzzywuzzy import fuzz

def fuzz_search(word : str, wordList : list, compareElement : str ="description", threshold : int = 60):
    grade = 0
    match = None

    for element in wordList:
        score = fuzz.ratio(word, element.get(compareElement, "").lower())
        if score > grade:
            grade = score
            match = element

    if grade >= threshold:
        return grade, match
    return 0, None
