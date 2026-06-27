from datetime import date, datetime
from typing import List, Dict
import re

LETTER_VALUES: Dict[str, int] = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
}

VOWELS = set('AEIOU')
MASTER_NUMBERS = {11, 22, 33}

LUCKY_COLORS_MAP: Dict[int, List[str]] = {
    1: ["Gold", "Yellow", "Orange"],
    2: ["White", "Silver", "Cream"],
    3: ["Yellow", "Purple", "Pink"],
    4: ["Blue", "Grey", "Green"],
    5: ["Silver", "White", "Turquoise"],
    6: ["Blue", "Pink", "Green"],
    7: ["Violet", "Purple", "White"],
    8: ["Dark Blue", "Black", "Gold"],
    9: ["Red", "Pink", "Orange"],
    11: ["Silver", "White", "Indigo"],
    22: ["Gold", "Beige", "Blue"],
    33: ["Gold", "Violet", "White"],
}

LUCKY_DAYS_MAP: Dict[int, List[str]] = {
    1: ["Sunday", "Monday"],
    2: ["Monday", "Friday"],
    3: ["Thursday", "Friday"],
    4: ["Saturday", "Sunday"],
    5: ["Wednesday", "Friday"],
    6: ["Friday", "Wednesday"],
    7: ["Monday", "Sunday"],
    8: ["Saturday", "Thursday"],
    9: ["Tuesday", "Thursday"],
    11: ["Monday", "Wednesday"],
    22: ["Saturday", "Monday"],
    33: ["Thursday", "Friday"],
}

NUMBER_MEANINGS: Dict[int, str] = {
    1: "The Leader — Independence, ambition, and originality",
    2: "The Diplomat — Cooperation, sensitivity, and balance",
    3: "The Creative — Expression, joy, and communication",
    4: "The Builder — Stability, discipline, and hard work",
    5: "The Adventurer — Freedom, change, and versatility",
    6: "The Nurturer — Love, responsibility, and harmony",
    7: "The Seeker — Wisdom, introspection, and spirituality",
    8: "The Achiever — Power, material success, and authority",
    9: "The Humanitarian — Compassion, wisdom, and completion",
    11: "The Intuitive — Spiritual insight and enlightenment (Master Number)",
    22: "The Master Builder — Large-scale vision and achievement (Master Number)",
    33: "The Master Teacher — Ultimate compassion and guidance (Master Number)",
}


def reduce_number(n: int) -> int:
    """Reduce to single digit, preserving master numbers 11, 22, 33."""
    while n > 9 and n not in MASTER_NUMBERS:
        n = sum(int(d) for d in str(n))
    return n


def letter_value(c: str) -> int:
    return LETTER_VALUES.get(c.upper(), 0)


def calculate_life_path(dob: date) -> int:
    day = reduce_number(dob.day)
    month = reduce_number(dob.month)
    year = reduce_number(sum(int(d) for d in str(dob.year)))
    return reduce_number(day + month + year)


def calculate_destiny(full_name: str) -> int:
    total = sum(letter_value(c) for c in full_name if c.isalpha())
    return reduce_number(total)


def calculate_soul_urge(full_name: str) -> int:
    total = sum(letter_value(c) for c in full_name if c.upper() in VOWELS)
    return reduce_number(total)


def calculate_personality(full_name: str) -> int:
    total = sum(
        letter_value(c) for c in full_name
        if c.isalpha() and c.upper() not in VOWELS
    )
    return reduce_number(total)


def calculate_birthday(dob: date) -> int:
    return reduce_number(dob.day)


def calculate_personal_year(dob: date) -> int:
    current_year = datetime.now().year
    return reduce_number(dob.day + dob.month + current_year)


def get_lucky_numbers(life_path: int, destiny: int, soul_urge: int) -> List[int]:
    base = {life_path, destiny, soul_urge}
    extras = {reduce_number(life_path + destiny), reduce_number(destiny + soul_urge)}
    return sorted(list((base | extras) - {0}))[:5]


def get_number_meaning(n: int) -> str:
    return NUMBER_MEANINGS.get(n, "A powerful and unique vibration")


def generate_lucky_categories(first_name: str, last_name: str, lucky_numbers: List[int]) -> Dict[str, List[str]]:
    """Generate category-specific suggestions that land on a lucky destiny number."""
    categories: Dict[str, List[str]] = {
        "youtube": [],
        "instagram": [],
        "business": [],
        "personal": [],
        "email": [],
        "creative": [],
    }

    clean_first = re.sub(r"[^A-Za-z]", "", first_name)
    clean_last = re.sub(r"[^A-Za-z]", "", last_name)
    first_title = clean_first.title() or first_name.title()
    last_title = clean_last.title() or last_name.title()
    base_name = f"{clean_first}{clean_last}".lower() or f"{first_name}{last_name}".lower()
    lucky_set = set(lucky_numbers)

    def is_lucky(candidate: str) -> bool:
        return calculate_destiny(candidate) in lucky_set

    def add(category: str, candidate: str, limit: int = 4) -> bool:
        normalized = re.sub(r"\s+", " ", candidate).strip()
        if normalized and normalized not in categories[category] and is_lucky(normalized):
            categories[category].append(normalized)
        return len(categories[category]) >= limit

    # Personal spellings return the full display name so the checked vibration is transparent.
    personal_variants: List[str] = []
    for i, char in enumerate(first_title):
        if char.isalpha():
            personal_variants.append(first_title[:i] + char + first_title[i:])
    for suffix in ["a", "e", "h", "i", "y", "aa", "ia", "ah"]:
        personal_variants.append(f"{first_title}{suffix}")

    for variant in personal_variants:
        if add("personal", f"{variant} {last_title}"):
            break

    modifiers = ["", "Aura", "Prime", "Studio", "Works", "Live", "Light", "Vision", "Vibe", "Path", "Now", "One"]
    compact_modifiers = ["", "aura", "prime", "studio", "works", "live", "light", "vision", "vibe", "path", "now", "one"]

    def populate(category: str, formats: List[str], mod_values: List[str] = modifiers) -> None:
        for fmt in formats:
            for mod in mod_values:
                candidate = fmt.format(
                    first=first_title,
                    last=last_title,
                    base=base_name,
                    mod=mod,
                )
                candidate = candidate.replace("  ", " ").replace("..", ".").replace("._", "_").strip(". ")
                if add(category, candidate):
                    return

    populate("youtube", [
        "The {first} {mod} Channel",
        "{first} {mod} Vlogs",
        "{first} {last} {mod}",
        "Life with {first} {mod}",
        "{first} Explores {mod}",
        "Cosmic {first} {mod}",
    ])

    populate("instagram", [
        "@{base}.{mod}",
        "@real.{base}{mod}",
        "@iam{base}{mod}",
        "@the.{first}{mod}",
        "@{first}.vibes{mod}",
        "@daily.{base}{mod}",
    ], compact_modifiers)

    populate("business", [
        "{first} {mod} Creations",
        "{last} {mod} Enterprises",
        "{first} {mod} Solutions",
        "The {last} {mod} Co.",
        "{first} {mod} Ventures",
        "{first} {last} {mod} Consulting",
    ])

    populate("email", [
        "contact.{base}{mod}@gmail.com",
        "hello.{base}{mod}@gmail.com",
        "{base}.{mod}@gmail.com",
        "info.{base}{mod}@gmail.com",
        "me.{base}{mod}@gmail.com",
    ], compact_modifiers)

    populate("creative", [
        "The {first} {mod} Project",
        "{last} {mod} Symphony",
        "Echoes of {first} {mod}",
        "{first}'s {mod} Dream",
        "The {last} {mod} Chronicles",
        "Vision {first} {mod}",
    ])

    return categories


def calculate_all(
    first_name: str,
    middle_name: str | None,
    last_name: str,
    dob: date,
) -> dict:
    parts = [p for p in [first_name, middle_name, last_name] if p]
    full_name = " ".join(parts)

    life_path = calculate_life_path(dob)
    destiny = calculate_destiny(full_name)
    soul_urge = calculate_soul_urge(full_name)
    personality = calculate_personality(full_name)
    birthday = calculate_birthday(dob)
    personal_year = calculate_personal_year(dob)
    expression = calculate_destiny(full_name)  # Same as destiny in Pythagorean
    lucky_numbers = get_lucky_numbers(life_path, destiny, soul_urge)

    lucky_categories = generate_lucky_categories(first_name, last_name, lucky_numbers)

    return {
        "life_path": life_path,
        "destiny": destiny,
        "soul_urge": soul_urge,
        "personality": personality,
        "birthday": birthday,
        "personal_year": personal_year,
        "expression": expression,
        "lucky_numbers": lucky_numbers,
        "lucky_colors": LUCKY_COLORS_MAP.get(life_path, ["Gold", "Purple", "White"]),
        "lucky_days": LUCKY_DAYS_MAP.get(life_path, ["Monday", "Thursday"]),
        "lucky_categories": lucky_categories,
        "meanings": {
            "life_path": get_number_meaning(life_path),
            "destiny": get_number_meaning(destiny),
            "soul_urge": get_number_meaning(soul_urge),
            "personality": get_number_meaning(personality),
            "birthday": get_number_meaning(birthday),
            "personal_year": get_number_meaning(personal_year),
            "expression": get_number_meaning(expression),
        },
    }


DAILY_MEANINGS: Dict[int, str] = {
    1: "New Beginnings — A day for action, independence, and initiating new projects.",
    2: "Cooperation & Balance — A day for listening, building relationships, and harmony.",
    3: "Creative Expression — A day for communication, joy, social interactions, and art.",
    4: "Structure & Foundation — A day for organization, focus, work, and discipline.",
    5: "Freedom & Change — A day for adaptability, learning new things, and curiosity.",
    6: "Nurturing & Responsibility — A day for home, family, caring, and duty.",
    7: "Introspection & Wisdom — A day for quiet meditation, self-discovery, and analysis.",
    8: "Power & Abundance — A day for business, material decisions, and personal empowerment.",
    9: "Completion & Reflection — A day for letting go, finishing tasks, and compassion.",
}


def get_daily_meaning(n: int) -> str:
    return DAILY_MEANINGS.get(n, "A day of alignment and cosmic flow")


def calculate_personal_month(dob: date, target_date: date) -> int:
    personal_year = reduce_number(dob.day + dob.month + target_date.year)
    return reduce_number(personal_year + target_date.month)


def calculate_personal_day(dob: date, target_date: date) -> int:
    pm = calculate_personal_month(dob, target_date)
    return reduce_number(pm + target_date.day)
