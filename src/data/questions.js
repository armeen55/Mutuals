// MUTUALS Question Bank 3.0 — a real group-chat game, not an AI party pack.
// Core mechanic unchanged: you answer about YOURSELF (prompt), friends guess
// what you picked (about). Scoring is keyed by question id.
//
// Each question:
//   id, pack, lean, slot, heat, shareable, prompt, about, options
//
// pack: default | chaos | extended
// lean: duo | group | both
// slot: warmup | roast | receipt | ego | status | flirt | money | party | tension | sincere
// heat: 1 safe · 2 playful · 3 real · 4 spicy · 5 nuclear-but-playable        shareable: boolean

export const ALL_QUESTIONS = [
  // ============================ core bank ============================
  { id: "q1", pack: "default", lean: "both", slot: "receipt", heat: 3, shareable: true,
    prompt: "My most obvious texting crime is…", about: "{name}'s most obvious texting crime is…",
    options: ["Replying in my head", "Going dry on purpose", "Sending five messages", "Reacting instead of answering"] },
  { id: "q2", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "When I want attention, I usually…", about: "When {name} wants attention, they usually…",
    options: ["Act impossible to reach", "Post something targeted", "Start a random argument", "Pretend I don't"] },
  { id: "q3", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "The text from me that means I'm annoyed is…", about: "The text from {name} that means they're annoyed is…",
    options: ["ok", "lol you're good", "do whatever", "no reply at all"] },
  { id: "q4", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The tiny disrespect I clock immediately is…", about: "The tiny disrespect {name} clocks immediately is…",
    options: ["Not being invited", "Getting interrupted", "Being corrected in public", "A late reply, no apology"] },
  { id: "q5", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I pretend I forgot but absolutely remember?", about: "What does {name} pretend they forgot but absolutely remember?",
    options: ["Who showed up", "Who canceled", "Who copied me", "Who never checked in"] },
  { id: "q6", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "What am I delusional about in a charming way?", about: "What is {name} delusional about in a charming way?",
    options: ["My timing", "My taste", "How chill I am", "My read on people"] },
  { id: "q7", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I overestimate about myself?", about: "What does {name} overestimate about themselves?",
    options: ["How subtle I am", "How busy I am", "How right I am", "How mysterious I am"] },
  { id: "q8", pack: "default", lean: "group", slot: "receipt", heat: 2, shareable: true,
    prompt: "What invite actually gets me outside?", about: "What invite actually gets {name} outside?",
    options: ["Food is involved", "One person asks directly", "It's last-minute", "I can leave early"] },
  { id: "q9", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "When plans start dying, I usually…", about: "When plans start dying, {name} usually…",
    options: ["Save them", "Let them die", "Blame the group", "Make a better plan"] },
  { id: "q10", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "What makes me suddenly active in the group chat?", about: "What makes {name} suddenly active in the group chat?",
    options: ["Drama", "A plan forming", "Someone being wrong", "My name mentioned"] },
  { id: "q11", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What am I most likely to screenshot?", about: "What is {name} most likely to screenshot?",
    options: ["A wild take", "A compliment", "A receipt", "Something I shouldn't"] },
  { id: "q12", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What do I think I'm hiding well?", about: "What does {name} think they're hiding well?",
    options: ["When I'm annoyed", "When I'm jealous", "When I care", "When I'm bored"] },
  { id: "q13", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What is my role when the group gets messy?", about: "What is {name}'s role when the group gets messy?",
    options: ["The witness", "The lawyer", "The instigator", "The cleanup crew"] },
  { id: "q14", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I judge people for, unfairly?", about: "What does {name} judge people for, unfairly?",
    options: ["Bad texting", "Trying too hard", "Being late", "Acting too chill"] },
  { id: "q15", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What do I do when I'm trying not to care?", about: "What does {name} do when they're trying not to care?",
    options: ["Overdo the jokes", "Act unavailable", "Talk too much", "Get extremely logical"] },
  { id: "q16", pack: "default", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "What does the group know about me that I deny?", about: "What does the group know about {name} that they deny?",
    options: ["I'm sensitive", "I'm competitive", "I'm nosy", "I'm dramatic"] },
  { id: "q17", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What am I most likely to pretend is a joke?", about: "What is {name} most likely to pretend is a joke?",
    options: ["A real opinion", "A jealous comment", "A direct insult", "A confession"] },
  { id: "q18", pack: "default", lean: "both", slot: "sincere", heat: 3, shareable: false,
    prompt: "What makes me instantly respect someone?", about: "What makes {name} instantly respect someone?",
    options: ["They keep a secret", "They don't chase", "They admit when they're wrong", "They never keep score out loud"] },
  { id: "q19", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "What is my most predictable lie?", about: "What is {name}'s most predictable lie?",
    options: ["I'm almost there", "I'm fine", "I don't care", "I forgot"] },
  { id: "q20", pack: "chaos", lean: "group", slot: "chaos", heat: 5, shareable: true,
    prompt: "What would expose me fastest?", about: "What would expose {name} fastest?",
    options: ["Their search history", "Their screenshots", "Their notes app", "Their close-friends story"] },
  { id: "q21", pack: "default", lean: "group", slot: "ego", heat: 3, shareable: true,
    prompt: "What am I weirdly competitive about?", about: "What is {name} weirdly competitive about?",
    options: ["Being funny", "Being right", "Looking unbothered", "Knowing people best"] },
  { id: "q22", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I do when someone is clearly lying?", about: "What does {name} do when someone is clearly lying?",
    options: ["Let them finish", "Ask one dangerous question", "Hold eye contact", "Screenshot the evidence"] },
  { id: "q23", pack: "default", lean: "both", slot: "sincere", heat: 3, shareable: false, enabled: false,
    prompt: "What makes me feel weirdly chosen?", about: "What makes {name} feel weirdly chosen?",
    options: ["Being asked first", "Being saved a seat", "Being remembered", "Being defended when I'm gone"] },
  { id: "q24", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What would make the group say 'classic you'?", about: "What would make the group say 'classic {name}'?",
    options: ["Arriving late", "Starting drama", "Being right", "Making it a bit"] },
  { id: "q25", pack: "default", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "What makes me fold immediately on a crush?", about: "What makes {name} fold immediately on a crush?",
    options: ["They're funnier than me", "They barely text back", "They're a little mean", "They're way too confident"] },
  { id: "q26", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "How do you know a DM mattered to me?", about: "How do you know a DM mattered to {name}?",
    options: ["I waited to reply", "I screenshotted it", "I read it 10 times", "I told one person"] },
  { id: "q27", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "What do I quietly want to be ranked #1 in?", about: "What does {name} quietly want to be ranked #1 in?",
    options: ["Funniest", "Most attractive", "Smartest", "Most unbothered"] },
  { id: "q28", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "Whose attention do I act unbothered about but track closely?", about: "Whose attention does {name} act unbothered about but track closely?",
    options: ["An ex", "The popular one", "A crush", "Whoever's ignoring me"] },
  { id: "q29", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "The persona I post vs. who I actually am is…", about: "{name}'s posted persona vs. who they actually are is…",
    options: ["Way more chill online", "Way funnier online", "Way richer online", "Way more popular online"] },
  { id: "q30", pack: "default", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "My money tell in a group is…", about: "{name}'s money tell in a group is…",
    options: ["I always 'forgot' my card", "I overpay to look good", "I count every cent", "I go quiet at the bill"] },
  { id: "q31", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "The petty thing I've kept score of for too long is…", about: "The petty thing {name} has kept score of for too long is…",
    options: ["An unpaid debt", "A copied outfit", "A canceled plan", "An unreturned favor"] },
  { id: "q32", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "My group-chat reputation is mostly…", about: "{name}'s group-chat reputation is mostly…",
    options: ["The ghost", "The yapper", "The planner", "The menace"] },
  { id: "q33", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "What makes me feel left out the fastest?", about: "What makes {name} feel left out the fastest?",
    options: ["An inside joke I missed", "A photo I'm not in", "Plans I heard about late", "Two people getting close"] },
  { id: "q34", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "My most embarrassing recurring behavior is…", about: "{name}'s most embarrassing recurring behavior is…",
    options: ["Texting first too much", "Laughing at my own jokes", "Bringing up the same story", "Checking who viewed it"] },
  { id: "q35", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "Whose approval do I secretly chase in the group?", about: "Whose approval does {name} secretly chase in the group?",
    options: ["The funny one", "The honest one", "The popular one", "The one who left"] },
  { id: "q36", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "What flips me from chill to invested instantly?", about: "What flips {name} from chill to invested instantly?",
    options: ["Being challenged", "Being ignored", "A little jealousy", "Someone doubting me"] },
  { id: "q37", pack: "default", lean: "group", slot: "roast", heat: 3, shareable: true,
    prompt: "What's my most 'main character' moment?", about: "What's {name}'s most 'main character' moment?",
    options: ["Telling the long story", "Arriving last on purpose", "Crying at the function", "Making it about me"] },
  { id: "q38", pack: "default", lean: "both", slot: "receipt", heat: 4, shareable: true,
    prompt: "When I 'forgot to reply,' I really…", about: "When {name} 'forgot to reply,' they really…",
    options: ["Left you on read", "Got distracted, fair", "Didn't want to", "Was waiting for a better mood"] },
  { id: "q39", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "The validation I fish for without admitting it is…", about: "The validation {name} fishes for without admitting it is…",
    options: ["That I'm funny", "That I'm hot", "That I'm smart", "That I'm a good friend"] },
  { id: "q40", pack: "default", lean: "duo", slot: "tension", heat: 4, shareable: true,
    prompt: "How I act when I'm jealous is…", about: "How {name} acts when they're jealous is…",
    options: ["Suddenly very nice", "Suddenly very busy", "Passive-aggressive", "Weirdly competitive"] },
  { id: "q41", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "The thing I do for the story, not the experience, is…", about: "The thing {name} does for the story, not the experience, is…",
    options: ["The risky text", "The chaotic night out", "The dramatic exit", "The 'random' run-in"] },
  { id: "q42", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What gets me to actually leave the house?", about: "What gets {name} to actually leave the house?",
    options: ["Someone I like is going", "Free food", "Fear of missing the story", "A specific direct ask"] },
  { id: "q43", pack: "default", lean: "both", slot: "ego", heat: 4, shareable: true,
    prompt: "The 'I'm not like that' thing that is 100% me is…", about: "The 'I'm not like that' thing that is 100% {name} is…",
    options: ["I'm a hater sometimes", "I love attention", "I'm nosy", "I hold grudges"] },
  { id: "q44", pack: "default", lean: "group", slot: "status", heat: 3, shareable: true,
    prompt: "Who in the group am I lowkey trying to impress?", about: "Who in the group is {name} lowkey trying to impress?",
    options: ["The newest member", "The hard-to-read one", "The one I clashed with", "Honestly, everyone"] },
  { id: "q45", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false, enabled: false,
    prompt: "What do I want people to do without making me ask?", about: "What does {name} want people to do without making them ask?",
    options: ["Check in first", "Defend me", "Notice I'm off", "Just show up"] },
  { id: "q46", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false,
    prompt: "The compliment I act normal about but replay later is…", about: "The compliment {name} acts normal about but replays later is…",
    options: ["That I'm easy to be around", "That I'm actually funny", "That people trust me", "That I'm the loyal one"] },
  { id: "q47", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "Three drinks of energy in, I become…", about: "Three drinks of energy in, {name} becomes…",
    options: ["Everyone's hype man", "Suspiciously honest", "The planner", "Ready to go home"] },
  { id: "q48", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "My default move in an awkward silence is…", about: "{name}'s default move in an awkward silence is…",
    options: ["Make a joke", "Check my phone", "Ask a question", "Let it get worse"] },
  { id: "q49", pack: "default", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "What would my friends roast me for first?", about: "What would {name}'s friends roast them for first?",
    options: ["My type", "My confidence", "My excuses", "My playlists"] },
  { id: "q50", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The grudge I'd never admit I'm holding is about…", about: "The grudge {name} would never admit they're holding is about…",
    options: ["A friend who switched up", "Being left out once", "A joke that went too far", "Someone who one-upped me"] },
  { id: "q51", pack: "default", lean: "group", slot: "receipt", heat: 3, shareable: true,
    prompt: "In a group photo I'm the one who…", about: "In a group photo {name} is the one who…",
    options: ["Checks how I look first", "Posts before asking", "Detags myself", "Demands a retake"] },
  { id: "q52", pack: "default", lean: "both", slot: "warmup", heat: 2, shareable: true,
    prompt: "My most obvious tell when I'm lying is…", about: "{name}'s most obvious tell when they're lying is…",
    options: ["Too much detail", "I get quiet", "I laugh weird", "I change the subject"] },
  { id: "q53", pack: "default", lean: "group", slot: "ego", heat: 4, shareable: true,
    prompt: "What do I act humble about but secretly know I'm good at?", about: "What does {name} act humble about but secretly know they're good at?",
    options: ["Reading people", "Being funny", "Looking good", "Getting my way"] },
  { id: "q54", pack: "default", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "My flirting style is honestly…", about: "{name}'s flirting style is honestly…",
    options: ["Insulting them lovingly", "Going fully silent", "Oversharing on instinct", "Acting unbothered"] },
  { id: "q55", pack: "default", lean: "group", slot: "tension", heat: 4, shareable: true,
    prompt: "What starts a cold war between me and a friend?", about: "What starts a cold war between {name} and a friend?",
    options: ["A dry reply", "A copied move", "Being left out", "A backhanded compliment"] },
  { id: "q56", pack: "default", lean: "both", slot: "warmup", heat: 1, shareable: false,
    prompt: "My honest energy in a new group is…", about: "{name}'s honest energy in a new group is…",
    options: ["Quiet then chaotic", "Instant best friend", "Watching everyone", "Trying too hard"] },
  { id: "q57", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I say I'll do but everyone knows I won't?", about: "What does {name} say they'll do but everyone knows they won't?",
    options: ["Be on time", "Come out tonight", "Text back fast", "Let it go"] },
  { id: "q58", pack: "default", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "If the group ranked everyone, I'd panic about being…", about: "If the group ranked everyone, {name} would panic about being…",
    options: ["The least funny", "The least invited", "The least attractive", "The most forgettable"] },
  { id: "q59", pack: "default", lean: "both", slot: "roast", heat: 3, shareable: true,
    prompt: "My villain origin in this friend group was…", about: "{name}'s villain origin in this friend group was…",
    options: ["Getting left out once", "A betrayal nobody remembers but me", "Losing an argument", "Being underestimated"] },
  { id: "q60", pack: "default", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "The 'just curious' question I ask that isn't casual is…", about: "The 'just curious' question {name} asks that isn't casual is…",
    options: ["Who else is going?", "Did they say anything?", "Are you two close?", "Who saw it?"] },
  { id: "q61", pack: "default", lean: "group", slot: "receipt", heat: 4, shareable: true,
    prompt: "What do I do the second I sense gossip?", about: "What does {name} do the second they sense gossip?",
    options: ["Lean all the way in", "Pretend I'm above it", "Defend the absent person", "Take notes for later"] },
  { id: "q62", pack: "default", lean: "both", slot: "ego", heat: 3, shareable: true,
    prompt: "The thing I'll argue about for no reason is…", about: "The thing {name} will argue about for no reason is…",
    options: ["A take I half-believe", "Who's right about the past", "Directions", "Who's funnier"] },
  { id: "q63", pack: "default", lean: "duo", slot: "sincere", heat: 3, shareable: false, enabled: false,
    prompt: "What's the easiest way to actually reach me?", about: "What's the easiest way to actually reach {name}?",
    options: ["Be direct, no games", "Make me laugh", "Just keep showing up", "Catch me off guard"] },
  { id: "q64", pack: "chaos", lean: "group", slot: "chaos", heat: 5, shareable: true,
    prompt: "If my phone got passed around, the first thing I'd grab it back for is…", about: "If {name}'s phone got passed around, the first thing they'd grab it back for is…",
    options: ["My DMs", "My camera roll", "My notes app", "My search bar"] },

  // ============================ extended bank — spicier social questions ============================
  { id: "q65", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "The last time the night went off the rails, my first move was…", about: "When the night went off the rails, {name}'s first move was…",
    options: ["Find the funniest person", "Text someone I shouldn't", "Disappear", "Start confessing things"] },
  { id: "q66", pack: "extended", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "The purchase I had no business making was…", about: "The purchase {name} had no business making was…",
    options: ["Clothes", "Food delivery", "A trip", "Something for attention"] },
  { id: "q67", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "My worst dating habit is…", about: "{name}'s worst dating habit is…",
    options: ["Getting bored fast", "Ignoring red flags", "Needing a chase", "Acting too chill"] },
  { id: "q68", pack: "extended", lean: "both", slot: "flirt", heat: 5, shareable: true,
    prompt: "What temptation do I pretend I'm above?", about: "What temptation does {name} pretend they're above?",
    options: ["Texting back", "Stalking the page", "Flirting for validation", "Restarting something messy"] },
  { id: "q69", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "The person I become after two drinks is…", about: "The person {name} becomes after two drinks is…",
    options: ["Too honest", "Too friendly", "Too loud", "Too emotional"] },
  { id: "q70", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "What kind of person makes me fold fastest?", about: "What kind of person makes {name} fold fastest?",
    options: ["Funny and unavailable", "Hot and chaotic", "Calm and loaded", "Mean in a charming way"] },
  { id: "q71", pack: "extended", lean: "group", slot: "money", heat: 4, shareable: true,
    prompt: "My money red flag is…", about: "{name}'s money red flag is…",
    options: ["Convenience spending", "Pretending it's fine", "Keeping score", "Buying the image"] },
  { id: "q72", pack: "extended", lean: "group", slot: "status", heat: 5, shareable: true,
    prompt: "The thing I'd never admit made me jealous is…", about: "The thing {name} would never admit made them jealous is…",
    options: ["Someone's relationship", "Someone's money", "Someone's confidence", "Someone's attention"] },
  { id: "q73", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "The worst reason I've stayed too long is…", about: "The worst reason {name} has stayed too long is…",
    options: ["They were hot", "I liked the attention", "I hate starting over", "I wanted to win"] },
  { id: "q74", pack: "extended", lean: "group", slot: "chaos", heat: 4, shareable: true,
    prompt: "The version of me my friends should fear is…", about: "The version of {name} their friends should fear is…",
    options: ["Bored", "Drunk", "Ignored", "Newly single"] },
  { id: "q75", pack: "extended", lean: "both", slot: "flirt", heat: 4, shareable: true,
    prompt: "My type that I keep pretending isn't my type is…", about: "{name}'s type that they keep pretending isn't their type is…",
    options: ["Emotionally unavailable", "A little toxic", "Way too nice", "Out of my league"] },
  { id: "q76", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "How I end things is usually…", about: "How {name} ends things is usually…",
    options: ["Slow fade", "Pick a fight", "Ghost completely", "Stay friends suspiciously fast"] },
  { id: "q77", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "At the pregame I'm the one who…", about: "At the pregame {name} is the one who…",
    options: ["Pours too heavy", "Plays therapist", "Vanishes early", "Starts the chaos"] },
  { id: "q78", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "The text I send when I'm a little lonely is…", about: "The text {name} sends when they're a little lonely is…",
    options: ["'u up'", "A meme to an ex", "'we should hang'", "Nothing, I just lurk"] },
  { id: "q79", pack: "extended", lean: "group", slot: "money", heat: 4, shareable: true,
    prompt: "I overspend the most to…", about: "{name} overspends the most to…",
    options: ["Look generous", "Avoid the awkward split", "Impress someone", "Feel better fast"] },
  { id: "q80", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "My most questionable late-night decision pattern is…", about: "{name}'s most questionable late-night decision pattern is…",
    options: ["The second location", "The 2am text", "The 'one more'", "The emotional speech"] },
  { id: "q81", pack: "extended", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "What status thing do I pretend I don't care about?", about: "What status thing does {name} pretend they don't care about?",
    options: ["Who's doing better", "Who got invited", "Who's dating up", "Who's winning lately"] },
  { id: "q82", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I catch feelings fastest when someone…", about: "{name} catches feelings fastest when someone…",
    options: ["Roasts me well", "Withholds attention", "Is weirdly confident", "Remembers small things"] },
  { id: "q83", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What I do when I see an ex out is…", about: "What {name} does when they see an ex out is…",
    options: ["Suddenly thrive", "Leave quietly", "Get way too loud", "Text the group live"] },
  { id: "q84", pack: "extended", lean: "group", slot: "party", heat: 3, shareable: true,
    prompt: "My role on a night out is…", about: "{name}'s role on a night out is…",
    options: ["The instigator", "The mom friend", "The wildcard", "The first to bail"] },
  { id: "q85", pack: "extended", lean: "both", slot: "flirt", heat: 4, shareable: true,
    prompt: "My ego's favorite snack is…", about: "{name}'s ego's favorite snack is…",
    options: ["A like from the right person", "Being someone's 'what if'", "Being missed", "Winning the breakup"] },
  { id: "q86", pack: "extended", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "The thing I do drunk that the group always brings up is…", about: "The thing {name} does drunk that the group always brings up is…",
    options: ["The speeches", "The disappearing act", "The confessions", "The texting spree"] },
  { id: "q87", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I keep entertaining the wrong person because…", about: "{name} keeps entertaining the wrong person because…",
    options: ["The attention", "The chase", "The story", "I'm bored"] },
  { id: "q88", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What I do when I'm not the favorite anymore is…", about: "What {name} does when they're not the favorite anymore is…",
    options: ["Get extra charming", "Go cold", "Make a new friend out of spite", "Pretend not to notice"] },
  { id: "q89", pack: "extended", lean: "group", slot: "money", heat: 3, shareable: true,
    prompt: "The lie I tell myself about money is…", about: "The lie {name} tells themselves about money is…",
    options: ["It's an investment", "I deserve it", "I'll budget next month", "Everyone else does it"] },
  { id: "q90", pack: "extended", lean: "duo", slot: "flirt", heat: 4, shareable: true,
    prompt: "I'm most likely to flirt when…", about: "{name} is most likely to flirt when…",
    options: ["I'm a little bored", "I need a win", "Someone else wants them", "I've had two drinks"] },
  { id: "q91", pack: "extended", lean: "both", slot: "party", heat: 4, shareable: true,
    prompt: "My 'I'm just going for one' actually ends with…", about: "{name}'s 'I'm just going for one' actually ends with…",
    options: ["Closing the place", "A new best friend", "A regretted text", "Me home by 10, lying"] },
  { id: "q92", pack: "extended", lean: "group", slot: "status", heat: 4, shareable: true,
    prompt: "The flex I pretend is casual is…", about: "The flex {name} pretends is casual is…",
    options: ["Who I know", "What I spent", "Who wants me", "Where I've been"] },
  { id: "q93", pack: "extended", lean: "both", slot: "tension", heat: 4, shareable: true,
    prompt: "What makes me text the group at 2am is…", about: "What makes {name} text the group at 2am is…",
    options: ["A revelation", "A spiral", "A confession", "A plan nobody asked for"] },
  { id: "q94", pack: "extended", lean: "duo", slot: "flirt", heat: 5, shareable: true,
    prompt: "The red flag I find weirdly attractive is…", about: "The red flag {name} finds weirdly attractive is…",
    options: ["Too confident", "A little mean", "Emotionally unavailable", "Way too much"] },
  { id: "q95", pack: "extended", lean: "group", slot: "roast", heat: 4, shareable: true,
    prompt: "If my friends wrote my dating profile, the warning would be…", about: "If {name}'s friends wrote their dating profile, the warning would be…",
    options: ["Bores easily", "Falls fast", "Allergic to texting back", "Loves a project"] },
  { id: "q96", pack: "extended", lean: "both", slot: "sincere", heat: 3, shareable: false,
    prompt: "What I actually want but play too cool to say is…", about: "What {name} actually wants but plays too cool to say is…",
    options: ["To be chosen first", "To be pursued", "To matter to someone", "To be the priority"] },

  // ===================== name-pick bank — group "most likely to" =====================
  // type:"namepick" — options are participant names resolved at runtime (no fixed options).
  // {name} = the player who answered; {winner} = the person the group voted for.
  { id: "n1", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is most likely to itemize the bill down to the cent?",
    about: "Who did {name} pick to itemize the bill to the cent?",
    revealTitle: "The group voted {winner} the cheapest.",
    detailTemplates: ["Bill itemizer allegations. The group has spoken.", "Splitwise's most wanted."],
    shareText: "Everyone voted {winner} the cheapest. We played MUTUALS and the receipts are in." },
  { id: "n2", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here says 'I'm down' and then vanishes?",
    about: "Who did {name} pick as the one who says 'I'm down' then vanishes?",
    revealTitle: "The group crowned {winner} the biggest flake.",
    detailTemplates: ["Replies 'I'm down,' shows up never.", "The phantom RSVP."],
    shareText: "Everyone says {winner} flakes the hardest. MUTUALS has the receipts." },
  { id: "n3", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would sell someone out the funniest?",
    about: "Who did {name} pick to sell someone out the funniest?",
    revealTitle: "The group says {winner} would sell you out funniest.",
    detailTemplates: ["No loyalty, great timing.", "Snitch of the year, with jokes."],
    shareText: "The group says {winner} would sell you out funniest. MUTUALS." },
  { id: "n4", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here starts drama and calls it 'being honest'?",
    about: "Who did {name} pick as the one who starts drama and calls it honesty?",
    revealTitle: "{winner} got crowned the group instigator.",
    detailTemplates: ["'I'm just being honest.' Sure.", "Drama with a press release."],
    shareText: "The group voted {winner} the instigator. MUTUALS receipts attached." },
  { id: "n5", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 5, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the biggest liability with a screenshot?",
    about: "Who did {name} pick as the biggest screenshot liability?",
    revealTitle: "Nobody trusts {winner} with a screenshot.",
    detailTemplates: ["One screenshot from total chaos.", "Evidence handler, terrible at it."],
    shareText: "The group says {winner} can't be trusted with a screenshot. MUTUALS." },
  { id: "n6", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 5, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would text their ex tonight if nobody stopped them?",
    about: "Who did {name} pick to text their ex if nobody stopped them?",
    revealTitle: "{winner} is texting the ex, the group is sure of it.",
    detailTemplates: ["Somebody hide their phone.", "One bad night from a relapse."],
    shareText: "The group says {winner} would text the ex tonight. MUTUALS." },
  { id: "n7", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here goes broke trying to look casual?",
    about: "Who did {name} pick to go broke trying to look casual?",
    revealTitle: "{winner} goes broke looking effortless.",
    detailTemplates: ["Casual is the most expensive look.", "Bankrolling the unbothered act."],
    shareText: "The group says {winner} goes broke looking casual. MUTUALS." },
  { id: "n8", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here acts the most unbothered but checks everything?",
    about: "Who did {name} pick as most unbothered but secretly checking everything?",
    revealTitle: "{winner} acts unbothered and watches everything.",
    detailTemplates: ["Read receipts on, ego on the line.", "Unbothered for show only."],
    shareText: "The group says {winner} acts unbothered but checks everything. MUTUALS." },
  { id: "n9", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is secretly running the group?",
    about: "Who did {name} pick as the one secretly running the group?",
    revealTitle: "The group says {winner} is secretly running everything.",
    detailTemplates: ["The quiet operator.", "Pulls the strings, claims innocence."],
    shareText: "Turns out {winner} is secretly running our group. MUTUALS." },
  { id: "n10", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would make the best alibi?",
    about: "Who did {name} pick to be their alibi?",
    revealTitle: "{winner} is the group's go-to alibi.",
    detailTemplates: ["Lies clean, never folds.", "Would take it to the grave."],
    shareText: "The group trusts {winner} as the alibi. MUTUALS." },
  { id: "n11", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here leaves early and still gets talked about?",
    about: "Who did {name} pick to leave early and still get talked about?",
    revealTitle: "{winner} leaves early and still runs the night.",
    detailTemplates: ["Gone by 11, topic till 3.", "Absence is a power move."],
    shareText: "The group says {winner} leaves early and still gets talked about. MUTUALS." },
  { id: "n12", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the worst influence after midnight?",
    about: "Who did {name} pick as the worst influence after midnight?",
    revealTitle: "{winner} is the group's worst influence after midnight.",
    detailTemplates: ["'One more' is always their idea.", "Nothing good happens on their watch."],
    shareText: "The group voted {winner} the worst influence after midnight. MUTUALS." },
  { id: "n13", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would survive the group chat getting leaked?",
    about: "Who did {name} pick to survive the group chat getting leaked?",
    revealTitle: "{winner} would survive the group chat leak.",
    detailTemplates: ["Nothing to hide, or hides it well.", "Built different, types careful."],
    shareText: "The group says {winner} would survive the chat getting leaked. MUTUALS." },
  { id: "n14", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here flirts for sport?",
    about: "Who did {name} pick as the one who flirts for sport?",
    revealTitle: "{winner} flirts for sport, the group agrees.",
    detailTemplates: ["No feelings, all stats.", "It's not personal, it's recreation."],
    shareText: "The group says {winner} flirts for sport. MUTUALS." },
  { id: "n15", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would start a cold war over a dry reply?",
    about: "Who did {name} pick to start a cold war over a dry reply?",
    revealTitle: "{winner} starts a cold war over one dry text.",
    detailTemplates: ["One 'k' and it's on.", "Holds the line for weeks."],
    shareText: "The group says {winner} would start a cold war over a dry reply. MUTUALS." },
  { id: "n16", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here makes the night about them?",
    about: "Who did {name} pick to make the night about themselves?",
    revealTitle: "{winner} makes every night about them.",
    detailTemplates: ["Every story circles back.", "Never a supporting role."],
    shareText: "The group says {winner} makes the night about them. MUTUALS." },
  { id: "n17", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here gives the most dangerous advice?",
    about: "Who did {name} pick as the giver of the most dangerous advice?",
    revealTitle: "{winner} gives advice that ends friendships.",
    detailTemplates: ["'Text him.' Catastrophic.", "Confidence way past their qualifications."],
    shareText: "The group says {winner} gives the most dangerous advice. MUTUALS." },
  { id: "n18", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would accidentally expose everyone?",
    about: "Who did {name} pick to accidentally expose everyone?",
    revealTitle: "{winner} would expose the whole group by accident.",
    detailTemplates: ["Wrong chat, every time.", "A loose cannon with a camera roll."],
    shareText: "The group says {winner} would accidentally expose everyone. MUTUALS." },
  { id: "n19", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the most expensive friend to hang out with?",
    about: "Who did {name} pick as the most expensive friend to hang out with?",
    revealTitle: "{winner} is the most expensive friend to have.",
    detailTemplates: ["Every plan has a price tag.", "Your wallet fears them."],
    shareText: "The group voted {winner} the most expensive friend. MUTUALS." },
  { id: "n20", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here remembers a tiny disrespect forever?",
    about: "Who did {name} pick to remember a tiny disrespect forever?",
    revealTitle: "{winner} never forgets a single slight.",
    detailTemplates: ["A memory like a grudge museum.", "2019 still comes up."],
    shareText: "The group says {winner} remembers every tiny disrespect. MUTUALS." },
  { id: "n21", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here do you call when a lie needs to sound believable?",
    about: "Who did {name} pick to make a lie sound believable?",
    revealTitle: "{winner} is who you call to sell the story.",
    detailTemplates: ["Smooth under pressure.", "Never breaks character."],
    shareText: "The group calls {winner} when the lie has to land. MUTUALS." },
  { id: "n22", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here folds first if their crush texts?",
    about: "Who did {name} pick to fold first if their crush texted?",
    revealTitle: "{winner} folds the second their crush texts.",
    detailTemplates: ["All talk, zero defense.", "'Playing it cool' lasts 4 seconds."],
    shareText: "The group says {winner} folds first when the crush texts. MUTUALS." },
  { id: "n23", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here says 'be honest' and then gets mad?",
    about: "Who did {name} pick as the one who says 'be honest' then gets mad?",
    revealTitle: "{winner} can't handle the honesty they asked for.",
    detailTemplates: ["Asked for it. Furious about it.", "Honesty is a trap with them."],
    shareText: "The group says {winner} says 'be honest' then gets mad. MUTUALS." },
  { id: "n24", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the reason plans turn expensive?",
    about: "Who did {name} pick as the reason plans get expensive?",
    revealTitle: "{winner} is why the plans cost triple.",
    detailTemplates: ["'Let's just add one more thing.'", "The budget's natural enemy."],
    shareText: "The group says {winner} is why plans get expensive. MUTUALS." },
  { id: "n25", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is most likely to post something targeted?",
    about: "Who did {name} pick to post something targeted?",
    revealTitle: "{winner} posts with a target in mind.",
    detailTemplates: ["'It's not about anyone.' It's about someone.", "The aimed story."],
    shareText: "The group says {winner} posts targeted. MUTUALS." },
  { id: "n26", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here does everyone secretly watch for a reaction?",
    about: "Who did {name} pick as the one everyone watches for a reaction?",
    revealTitle: "Everyone watches {winner} for the reaction.",
    detailTemplates: ["The room's emotional weathervane.", "Their face is the group chat."],
    shareText: "The group says everyone watches {winner} for a reaction. MUTUALS." },
  { id: "n27", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would win a popularity contest and pretend not to care?",
    about: "Who did {name} pick to win popularity and pretend not to care?",
    revealTitle: "{winner} wins the room and acts surprised.",
    detailTemplates: ["Loved by all, admits nothing.", "Humble flex specialist."],
    shareText: "The group says {winner} wins popularity and pretends not to care. MUTUALS." },
  { id: "n28", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the safest with a secret?",
    about: "Who did {name} pick as the safest with a secret?",
    revealTitle: "{winner} is the group's actual vault.",
    detailTemplates: ["Tells no one. Ever.", "Secrets go in, nothing comes out."],
    shareText: "The group trusts {winner} most with a secret. MUTUALS." },
  { id: "n29", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 5, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the least safe with a secret?",
    about: "Who did {name} pick as the least safe with a secret?",
    revealTitle: "Nobody tells {winner} anything anymore.",
    detailTemplates: ["A secret has a 9-minute shelf life.", "Leaks faster than the wifi."],
    shareText: "The group says {winner} can't keep a secret. MUTUALS." },
  { id: "n30", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the group's unofficial lawyer?",
    about: "Who did {name} pick as the group's unofficial lawyer?",
    revealTitle: "{winner} is the group's unofficial lawyer.",
    detailTemplates: ["Argues everything to the ground.", "Objection: everything."],
    shareText: "The group voted {winner} the unofficial lawyer. MUTUALS." },
  { id: "n31", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the group's main character against their will?",
    about: "Who did {name} pick as the reluctant main character?",
    revealTitle: "{winner} is the main character and hates it.",
    detailTemplates: ["The story finds them.", "Drama magnet, fully innocent."],
    shareText: "The group says {winner} is the main character against their will. MUTUALS." },
  { id: "n32", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is most likely to disappear at the function?",
    about: "Who did {name} pick to disappear at the function?",
    revealTitle: "{winner} ghosts mid-function, every time.",
    detailTemplates: ["Here, then gone, no text.", "The Irish exit world champion."],
    shareText: "The group says {winner} vanishes at the function. MUTUALS." },
  { id: "n33", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here turns a casual hangout into a story?",
    about: "Who did {name} pick to turn a casual hangout into a whole story?",
    revealTitle: "{winner} can't do casual — it becomes a saga.",
    detailTemplates: ["Coffee becomes a chapter.", "No such thing as a quiet night."],
    shareText: "The group says {winner} turns any hangout into a story. MUTUALS." },
  { id: "n34", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is right but unbearable about it?",
    about: "Who did {name} pick as right but unbearable about it?",
    revealTitle: "{winner} is always right and never quiet about it.",
    detailTemplates: ["Correct and insufferable.", "'I told you so' on a loop."],
    shareText: "The group says {winner} is right but annoying about it. MUTUALS." },
  { id: "n35", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would get exposed by their notes app?",
    about: "Who did {name} pick to get exposed by their notes app?",
    revealTitle: "{winner}'s notes app could end them.",
    detailTemplates: ["Lists, drafts, evidence.", "Do not open the notes app."],
    shareText: "The group says {winner} would get exposed by their notes app. MUTUALS." },
  { id: "n36", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here holds the whole group together?",
    about: "Who did {name} pick as the one holding the group together?",
    revealTitle: "{winner} is the glue holding this group together.",
    detailTemplates: ["Plans it, saves it, carries it.", "The group would fold without them."],
    shareText: "The group says {winner} holds everyone together. MUTUALS." },
  { id: "n37", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is secretly the most sensitive?",
    about: "Who did {name} pick as secretly the most sensitive?",
    revealTitle: "{winner} is secretly the soft one.",
    detailTemplates: ["Tough act, tender core.", "Feels everything, admits nothing."],
    shareText: "The group says {winner} is secretly the most sensitive. MUTUALS." },
  { id: "n38", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here would you call first in actual trouble?",
    about: "Who did {name} pick to call first in actual trouble?",
    revealTitle: "{winner} is the first call when it's real.",
    detailTemplates: ["Shows up, no questions.", "Ride-or-die, confirmed."],
    shareText: "The group says {winner} is the first call in real trouble. MUTUALS." },
  { id: "n39", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 4, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here is the biggest menace when bored?",
    about: "Who did {name} pick as the biggest menace when bored?",
    revealTitle: "{winner} is a menace the second they're bored.",
    detailTemplates: ["Boredom is a threat to everyone.", "Idle hands, group chaos."],
    shareText: "The group says {winner} is the biggest menace when bored. MUTUALS." },
  { id: "n40", type: "namepick", pack: "group", lean: "group", slot: "namepick", heat: 3, shareable: true, minPlayers: 3, excludeSelf: false,
    prompt: "Who here makes the group say 'classic you'?",
    about: "Who did {name} pick as the 'classic you' friend?",
    revealTitle: "{winner} is peak 'classic you.'",
    detailTemplates: ["So on-brand it's a genre.", "Predictable in the funniest way."],
    shareText: "The group says {winner} is 'classic you' material. MUTUALS." },

];

// Every question carries a `type`. Existing self-MCQ questions default to "self";
// the n* bank above is "namepick" (runtime participant options, no fixed list).
for (const q of ALL_QUESTIONS) if (!q.type) q.type = "self";

const BY_ID = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));
export function getQuestion(id) {
  return BY_ID[id] || null;
}

export function fillName(template, name) {
  return String(template || "").replace(/\{name\}/g, name || "they");
}

// {winner} fill for name-pick reveal titles / share text.
export function fillWinner(template, winner) {
  return String(template || "").replace(/\{winner\}/g, winner || "the group");
}

// ---------------- name-pick (participant option) helpers ----------------
export function isNamePick(q) {
  return !!q && q.type === "namepick";
}

// Stable participant ordering: earliest join first, id as a deterministic
// tiebreak. joinedAt may be a number (local) or ISO string (Supabase).
export function orderedParticipants(participants) {
  const ts = (p) => {
    const j = p && p.joinedAt;
    if (typeof j === "number") return j;
    const t = Date.parse(j);
    return isNaN(t) ? 0 : t;
  };
  return [...(participants || [])].sort(
    (a, b) => ts(a) - ts(b) || String(a.id).localeCompare(String(b.id))
  );
}

// The option list for a name-pick question: the earliest ≤4 participants by
// join time. This set is FROZEN — appending a 5th participant never shifts
// indices 0–2, so every player (and every late joiner) maps option_index to the
// same person. Returns [] when there aren't enough players yet.
// `groupId` is accepted for signature stability (not needed for the frozen rule).
export function participantOptionsForQuestion(q, participants, groupId) {
  if (!isNamePick(q)) return [];
  const ordered = orderedParticipants(participants);
  if (ordered.length < (q.minPlayers || 3)) return [];
  return ordered.slice(0, 4).map((p) => ({ id: p.id, name: p.displayName }));
}

// Map an option index back to a human label (participant name for name-pick,
// fixed option text for self). Used by Answer/Guess/insights consistently.
export function labelForOption(q, optionIndex, participants, groupId) {
  if (isNamePick(q)) {
    const opts = participantOptionsForQuestion(q, participants, groupId);
    return opts[optionIndex] ? opts[optionIndex].name : "?";
  }
  const o = (q && q.options) || [];
  return o[optionIndex] != null ? o[optionIndex] : "?";
}

// ---------------- deterministic helpers ----------------
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffled(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// How many questions this room runs — 5–8, stable per room (seeded apart from
// the content shuffle so count and questions vary independently). No more
// hardcoded 6 anywhere: Answer/Guess/Reveal all read this via selectQuestions.
export function roomQuestionCount(groupId) {
  return 5 + (hashStr("count:" + String(groupId || "default")) % 4);
}

// "Spice" weighting used for receipt-card priority and tie-breaks.
const SLOT_WEIGHT = {
  receipt: 6, chaos: 6, tension: 5, flirt: 5, money: 4, party: 4, status: 4, ego: 4, roast: 3, warmup: 1, sincere: 0, namepick: 5,
};
export function spiceScore(q) {
  if (!q) return 0;
  return (q.shareable ? 10 : 0) + (q.heat || 0) * 2 + (SLOT_WEIGHT[q.slot] || 0);
}

const WARMUP = ["warmup", "roast"];
const RECEIPT = ["receipt"];
const STATUSY = ["ego", "status", "money"];
const HOT = ["tension", "flirt", "party"];
const SOFT = ["sincere"];

// Build a self-MCQ episode (rhythm + caps) from a self-question pool,
// deterministic per room. Used for duo, and for the self portion of group.
function selfEpisode(pool, n, mode) {
  const used = new Set();
  const out = [];
  let sincere = 0;
  let heat5 = 0;
  let shareable = 0;
  const ok = (q) =>
    !used.has(q.id) && (q.slot !== "sincere" || sincere < 2) && (q.heat < 5 || heat5 < 2);
  const push = (q) => {
    used.add(q.id);
    out.push(q);
    if (q.slot === "sincere") sincere += 1;
    if (q.heat >= 5) heat5 += 1;
    if (q.shareable) shareable += 1;
  };
  const take = (slots, extra) => {
    const q = pool.find((x) => ok(x) && slots.includes(x.slot) && (!extra || extra(x)));
    if (q) push(q);
    return !!q;
  };
  const takeAny = () => {
    const q = pool.find((x) => ok(x));
    if (q) push(q);
    return !!q;
  };
  const steps = [
    () => take(WARMUP) || take(RECEIPT),
    () => take(RECEIPT) || take(WARMUP),
    () => take(STATUSY) || take(RECEIPT),
    () => take(HOT) || take(STATUSY),
    () => (sincere < 2 ? take(SOFT) : false) || take(WARMUP) || take(HOT),
    () => take(["chaos"], (x) => x.shareable) || take(RECEIPT, (x) => x.shareable) || take(HOT),
  ];
  for (let i = 0; i < n; i++) {
    if (!steps[i % steps.length]()) takeAny();
  }
  for (let i = 0; shareable < 3 && i < out.length; i++) {
    if (out[i].shareable) continue;
    const repl = pool.find((x) => ok(x) && x.shareable);
    if (!repl) break;
    const removed = out[i];
    used.delete(removed.id);
    if (removed.slot === "sincere") sincere -= 1;
    if (removed.heat >= 5) heat5 -= 1;
    out[i] = repl;
    used.add(repl.id);
    shareable += 1;
  }
  if (mode === "duo" || mode === "group") {
    const rank = (q) => (q.lean === mode ? 0 : q.lean === "both" ? 1 : 2);
    out.sort((a, b) => rank(a) - rank(b));
  }
  return out;
}

// Deterministic 5–8 episode for a room. The SET is groupId-seeded — identical
// for EVERY player, so guess/reveal stay in lockstep regardless of who is
// looking or how many have joined. DUO = self-MCQ only. GROUP = a hybrid that
// leads with name-pick "most likely to" votes (≥3) plus self-MCQ (≥2). A
// name-pick's *answerability* (needs ≥3 players for ≥3 options) is resolved
// later at answer/guess time; the SET never depends on live participant count.
export function selectQuestions(groupId, mode, count, _opts = {}) {
  const n = count || roomQuestionCount(groupId);
  const enabled = ALL_QUESTIONS.filter((q) => q.enabled !== false);
  const selfRng = mulberry32(hashStr(String(groupId || "default")));
  const selfPool = shuffled(enabled.filter((q) => !isNamePick(q)), selfRng);

  if (mode !== "group") return selfEpisode(selfPool, n, mode);

  // GROUP hybrid: ~60% name-pick (≥3), the rest self-MCQ (≥2).
  const npRng = mulberry32(hashStr("namepick:" + String(groupId || "default")));
  const npPool = shuffled(enabled.filter((q) => isNamePick(q)), npRng);
  const npCount = Math.max(3, Math.min(n - 2, Math.round(n * 0.6)));
  const namepicks = npPool.slice(0, Math.min(npCount, npPool.length));
  const selfTarget = n - namepicks.length;

  const selfPicks = [];
  const slots = new Set();
  for (const q of selfPool) {
    if (selfPicks.length >= selfTarget) break;
    if (q.slot === "sincere" || slots.has(q.slot)) continue;
    selfPicks.push(q);
    slots.add(q.slot);
  }
  for (const q of selfPool) {
    if (selfPicks.length >= selfTarget) break;
    if (selfPicks.includes(q) || q.slot === "sincere") continue;
    selfPicks.push(q);
  }

  // interleave so name-picks never run 3+ in a row (self questions as dividers)
  const merged = [];
  const np = [...namepicks];
  const sf = [...selfPicks];
  let run = 0;
  while (np.length || sf.length) {
    if (np.length && (run < 2 || !sf.length)) {
      merged.push(np.shift());
      run += 1;
    } else if (sf.length) {
      merged.push(sf.shift());
      run = 0;
    } else if (np.length) {
      merged.push(np.shift());
      run += 1;
    }
  }
  return merged;
}

// A stable mode-leaning preview (e.g. for a "what you'll be asked" peek).
export function previewQuestionsForMode(mode, count = 6) {
  return selectQuestions("preview-" + (mode || "duo"), mode, count);
}

// Name-pick questions this player can answer NOW but hasn't — drives the reveal
// "add your group votes" nudge for the host/late joiners who reached Answer
// before the room had 3 people (name-picks were deferred then).
export function pendingNamePicks(groupId, mode, participants, selfAnswers) {
  if (mode !== "group") return [];
  const sa = selfAnswers || {};
  return selectQuestions(groupId, mode).filter(
    (q) => isNamePick(q) && sa[q.id] == null && participantOptionsForQuestion(q, participants, groupId).length >= 3
  );
}

// ---------------- dev/debug ----------------
export function questionCountByLean() {
  const c = { duo: 0, group: 0, both: 0, total: ALL_QUESTIONS.length };
  for (const q of ALL_QUESTIONS) c[q.lean] = (c[q.lean] || 0) + 1;
  return c;
}

const FORBIDDEN = [
  "love language", "healing", "safe space", "boundaries", "attachment", "zombie",
  "dog at the party", "vibe check", "hot take machine", "main character energy",
  "trauma-free", "therapy",
];
const FORBIDDEN_WORD = [/\bhr\b/, /\bvalid\b/];
export function validateQuestionBank() {
  const enabled = ALL_QUESTIONS.filter((q) => q.enabled !== false);
  const selfQs = enabled.filter((q) => q.type !== "namepick");
  const namepickQs = enabled.filter((q) => q.type === "namepick");
  const tally = (arr, key) =>
    arr.reduce((m, q) => ((m[q[key]] = (m[q[key]] || 0) + 1), m), {});
  const issues = [];
  const seenPrompt = new Set();
  for (const q of ALL_QUESTIONS) {
    for (const f of ["id", "type", "pack", "lean", "slot", "prompt", "about"]) {
      if (q[f] == null) issues.push(`${q.id}: missing ${f}`);
    }
    if (typeof q.heat !== "number") issues.push(`${q.id}: missing heat`);
    if (typeof q.shareable !== "boolean") issues.push(`${q.id}: missing shareable`);
    const p = (q.prompt || "").toLowerCase();
    if (seenPrompt.has(p)) issues.push(`${q.id}: duplicate prompt`);
    seenPrompt.add(p);
    const text = [q.prompt, q.about, q.revealTitle, q.shareText, (q.options || []).join(" "), (q.detailTemplates || []).join(" ")]
      .join(" ")
      .toLowerCase();
    for (const f of FORBIDDEN) if (text.includes(f)) issues.push(`${q.id}: forbidden "${f}"`);
    for (const re of FORBIDDEN_WORD) if (re.test(text)) issues.push(`${q.id}: forbidden "${re.source}"`);
    if (q.type === "namepick") {
      if (Array.isArray(q.options) && q.options.length) issues.push(`${q.id}: namepick must not have fixed options`);
      for (const f of ["minPlayers", "revealTitle", "shareText"]) if (q[f] == null) issues.push(`${q.id}: namepick missing ${f}`);
    } else {
      if (!Array.isArray(q.options) || q.options.length !== 4) issues.push(`${q.id}: self options not 4`);
      else if (new Set(q.options).size !== q.options.length) issues.push(`${q.id}: repeated option`);
    }
  }

  // Selected-episode checks on a sample room.
  const gEp = selectQuestions("validate-group", "group", 6);
  const dEp = selectQuestions("validate-duo", "duo", 6);
  const gNamepick = gEp.filter((q) => q.type === "namepick").length;
  const gSelf = gEp.filter((q) => q.type !== "namepick").length;
  const gShareable = gEp.filter((q) => q.shareable).length;
  const gSincere = gEp.filter((q) => q.slot === "sincere").length;
  if (gNamepick < 3) issues.push(`group episode: only ${gNamepick} namepick (need >=3)`);
  if (gSelf < 2) issues.push(`group episode: only ${gSelf} self (need >=2)`);
  if (gShareable < 4) issues.push(`group episode: only ${gShareable} shareable (need >=4)`);
  if (gSincere > 1) issues.push(`group episode: ${gSincere} sincere (max 1)`);
  if (dEp.some((q) => q.type === "namepick")) issues.push(`duo episode: contains namepick`);
  let runSlot = null;
  let runLen = 0;
  let maxRun = 0;
  for (const q of gEp) {
    if (q.slot === runSlot) runLen += 1;
    else { runSlot = q.slot; runLen = 1; }
    maxRun = Math.max(maxRun, runLen);
  }
  if (maxRun > 2) issues.push(`group episode: ${maxRun} same-slot in a row (max 2)`);

  const softCombined = selfQs.filter((q) =>
    /quiet|misunderstood|reassur|compliment/i.test(q.prompt + " " + (q.options || []).join(" "))
  ).length;
  return {
    total: ALL_QUESTIONS.length,
    self: selfQs.length,
    namepick: namepickQs.length,
    byPack: tally(enabled, "pack"),
    byLean: tally(selfQs, "lean"),
    bySlot: tally(enabled, "slot"),
    byHeat: tally(enabled, "heat"),
    shareable: enabled.filter((q) => q.shareable).length,
    heat4: enabled.filter((q) => q.heat === 4).length,
    heat5: enabled.filter((q) => q.heat === 5).length,
    sincere: selfQs.filter((q) => q.slot === "sincere").length,
    softCombined,
    groupEpisode: { namepick: gNamepick, self: gSelf, shareable: gShareable, maxSlotRun: maxRun },
    duoEpisodeNamepick: dEp.filter((q) => q.type === "namepick").length,
    issues,
  };
}
