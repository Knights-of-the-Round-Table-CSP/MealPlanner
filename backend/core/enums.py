from enum import IntFlag, auto

class RecipeFlags(IntFlag):
    IS_SAVED = auto()       # 1
    IS_BREAKFAST = auto()   # 2
    IS_LUNCH = auto()       # 4
    IS_DINNER = auto()      # 8
    IS_LONG = auto()        # ...
