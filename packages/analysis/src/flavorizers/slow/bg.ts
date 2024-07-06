import multireplacer from '../../dsl/multireplacer';

export default () =>
  multireplacer
    .named('Interslavic → Bulgarian')
    .rule('Ignore case', (r) => r.lowerCase())

    //#region Nouns
    .section('Nouns')
    .rule('-ne/-nie ending', (r) => r.regexp(/ńje\b/, ['ne', 'nie']))
    .rule('-ie ending', (r) => r.regexp(/([ĺŕťďśź])je\b/, ['$1ie']))
    // except grozd́je & possibly others
    .rule('ś before vowel', (r) => r.regexp(/ś([aeiouyåėéęěųȯó])/, ['sь$1']))
    //#endregion


    //#region Verbs
    .section('Verbs')
    .rule('Infinitive -> 1st person',
      (r) => r.regexp(/ti\b/, [
        'ų', // 1st conjucation
        'jų',  // 2nd conjucation
        'm', 'am', 'jam', 'vam', 'vjam', // 3rd conjucation
      ]),
      (p) => p.partOfSpeech('v.'),
    )
    //#endregion


    //#region Adjectives
    .section('Adjectives')
    .rule('ADJ -nji',
      (r) => r.regexp(/nji\b/, ['ny']),
      (p) => p.partOfSpeech('adj.'),
    )
    
    // ↑ This rule chains into the next four ↓
    
    .rule('ADJ -(C)ny -> -en/oven',  // pȯlny, mirny/vinny, vŕhny
      (r) => r.regexp(/([^aeiouyåėéęěųȯó])ny\b/, ['$1en', '$1oven']),
      (p) => p.partOfSpeech('adj.'),
      // except pitny -> piteen/pitejno/a/i
    )
    .rule('Special case: ADJ -dany -> -daden (from verb "dati)"',
      (r) => r.regexp(/dany\b/, ['daden']),
      (p) => p.partOfSpeech('adj.')
    )
    .rule('Special case: ADJ -any -> -anen/-an',  // rany, izprodany, učarovany
      (r) => r.regexp(/any\b/, ['an', 'anen']),
      (p) => p.partOfSpeech('adj.'),
    )
    .rule('ADJ -(V)ny -> -nen/-n',
      (r) => r.regexp(/([eiouyåėęěųȯ])ny\b/, ['$1nen']),
      (p) => p.partOfSpeech('adj.'),
    )
    
    
    .rule('ADJ Distinction -čny <-> -česky',
      (r) => r.regexp(/čny\b/, ['čen', 'česki']),
      (p) => p.partOfSpeech('adj.'),
    )
    .rule('ADJ -ńji -> -nski',  // ONLY jeleńji & delfińji from slovnik
      (r) => r.regexp(/(ńji|ńje)\b/, ['nski']),
      (p) => p.partOfSpeech('adj.'),
    )

    .rule('ADJ -y -> -',  // novy -> nov
      (r) => r.regexp(/([^n])y\b/, ['$1']),
      (p) => p.partOfSpeech('adj.'),
    )

    // .rule('ADJ Soft: -ji',  // božji -> boži, kravji -> kravi
    //   (r) => r.regexp(/ji\b/, ['i']),
    //   (p) => p.partOfSpeech('adj.'),
    // ) // this is a compromize between a couple special cases

    // The above is handled by an entry in 'Cyrillic mapping - Iotation'

    .rule('ADJ Soft: singular -i => -',
      (r) => r.regexp(/([čšžjŕťďśźćđc])i\b/, ['$1']),
      (p) => p.partOfSpeech('adj.'),
    )
    .rule('ADJ Soft: singular -e => -o',
      (r) => r.regexp(/([čšžjŕťďśźćđc])e\b/, ['$1o']),
      (p) => p.partOfSpeech('adj.'),
    )
    //#endregion

    //#region Lost distinctions
    .rule('Animateness: ADJ PL ',
      (r) => r.regexp(/e\b/, ['i']),
      (p) => p.partOfSpeech('adj.pl.'),
    )
    .rule('Animateness: NOUN MASC PL',
      (r) => r.regexp(/e\b/, ['i']),
      (p) => p.partOfSpeech('m.pl.'),
    )
    .rule('Soft Declension: NOUN FEM PL',
      (r) => r.regexp(/e\b/, ['i']),
      (p) => p.partOfSpeech('f.pl.'),
    )
    //#endregion

    //#region Borrowings
    .section('Borrowings')
    .rule('Borrowed Russian часть <- ISV čęsť -> BG част',
      (r) => r.regexp(/čęst/, ['čast']),
      (p) => p.partOfSpeech('noun')
    )
    // an exception CAUSED by this rule:  čęstota  - should be "čestota"
    // an exception IGNORED by this rule: čęstičny - should be "častičny"

    .rule('Borrowed Russian начало <- ISV načęlo',
      (r) => r.regexp(/načęl/, ['načal']),
    )  // includes noun "načęlo" and verb "načęti (sę)"
    /**
     * A note should be made of the word (phrase) "начело (с)" in
     * Bulgarian. The phrase means "with a leader of", or
     * "being lead by" and so removing this rule may cause confusion
     * and mixup with this phrase. Although context is probably enough.
     */

    //#endregion

    //#region Phonetic changes/Orthography
    .section('Phonetic changes/Orthography')
    .rule('Yat Alternation', (r) => r.regexp(/ě/, ['e', 'ja', 'a']))
    
    // .rule('Bulgarian & Russian Ę', (r) => r.regexp(/ę/, ['e', 'ja']))
    // if this rule is ommited, "ę: e" should be added to the final
    // latin -> cyrillic replacement map.
    
    .rule('Word-final Ų spelling', (r) => r.regexp(/ų\b/, ['a']))
    .rule('Fleeting Ȯ', (r) => r.regexp(/[òȯ]/, ['ȯ', '']))
    .rule('Soft consonant pre-vowel', (r) => r.regexp(
      /([ĺńŕťďśź])([aeiouyåėéęěųȯó])/, ['$1ь$2']
    ))
    // .rule('ŠT/ŠČ/ČT => ŠT', (r) => r.regexp(/št|šč|čt/, ['щ']))
    //#endregion


    //#region Syllabic R/L
    .section('Syllabic')
    .rule('Syllabic R', (r) =>
      r.regexp(/([^aeiouyåėèęěųȯò])[rṙŕ]([^aeiouyåėèęěųȯò])/, [
        '$1ȯr$2', '$1rȯ$2'
      ]),
    )
    .rule('Soft syllabic R pre-vowel (e.g. ČRV/ČRNY/ŽRTV)', (r) =>  // e.g. črveny, črny, črv, žrtva
      r.regexp(/([^aeiouyåėèęěųȯò])[čžš][rṙŕ]/, [
        '$1ėr', '$1rė'
      ]),
    )
    .rule('Soft syllabic R post-vowel (e.g. OČRNI)', (r) =>  // e.g. očrniti
      r.regexp(/[čžš][rṙŕ]([^aeiouyåėèęěųȯò])/, [
        '$1ėr', '$1rė'
      ]),
    )
    .rule('Syllabic L', (r) =>
      r.regexp(/([^aeiouyåėèęěųȯò])[lŀ]([^aeiouyåėèęěųȯò])/, [
        '$1ȯl$2', '$1lȯ$2'
      ]),
    )
    .rule('Syllabic R/L - Finalization', (r) =>
      r.map({
        ŕ: 'r',
        ṙ: 'r',
        ŀ: 'l',
      }),
    )
    //#endregion

    .section('Cyrillic mapping')
    .rule('Cyrillic mapping - always true or unhandled', (r) =>
      // Strict etymological sound changes (e.g. from Latin "y" -> И)
      r.map({
        å: 'а',
        è: 'е',
        ė: 'е',
        ò: 'ъ',
        ȯ: 'ъ',
        ù: 'в',
        y: 'и',
        // possibly handled:
        ę: 'е',  // if not handled by rule "Bulgarian & Russian Ę"
        // ě: 'е',  // if not handled by rule "Yat Alternation" (not reccomended)
      })
    )
    .rule('Word-specific letter combinations', (r) =>
      r.map({
        člo: 'чо',  // člověk and derived words
      })
    )
    .rule('Cyrillic mapping - Щ regexp', (r) => r.regexp(/(š[čt])|(čt)/, ['щ']))
    .rule('Cyrillic mapping - Presoftned vowels',(r) => 
      r.map({
        // from rule "Soft consonant pre-vowel"
        ьa: 'я',  // includes å, Rusisan ę
        ьe: 'е',  // includes è/ė, ě, ę
        ьi: 'и',
        ьu: 'ю',
        ь: '',  // remove possible leftovers
      })
    )
    .rule('Cyrillic mapping - Iotation', (r) =>
      r.map({
        ja: 'я',  // includes å, Russian ę
        je: 'е',  // includes è/ė, ě, ę
        ji: 'и',
        jo: 'ьо',
        ju: 'ю',
        // etymological iotation
        jų: 'я',
      })
    )
    .rule('Cyrillic mapping - lj, nj', (r) =>
      r.map({
        // the following do not include e.g. ljubov becuase of the above ju -> ю
        // it should only apply to word endings and consonant clusters
        lj: 'л',
        nj: 'н',
        ĺj: 'л',
        ńj: 'н',
      })
    )
    .rule('Cyrillic mapping - standard latin', (r) =>
      r.map({
        a: 'а',
        b: 'б',
        c: 'ц',
        č: 'ч',
        d: 'д',
        e: 'е',
        f: 'ф',
        g: 'г',
        h: 'х',
        i: 'и',
        j: 'й',
        k: 'к',
        l: 'л',
        m: 'м',
        n: 'н',
        o: 'о',
        p: 'п',
        r: 'р',
        s: 'с',
        š: 'ш',
        t: 'т',
        u: 'у',
        v: 'в',
        z: 'з',
        ž: 'ж',
      })
    )
    .rule('Cyrillic mapping - etymological vowels', (r) =>
      r.map({
        ų: 'ъ',
      })
    )
    .rule('Cyrillic mapping - soft/etymological consonants', (r) =>
      r.map({
        ć: 'щ',
        đ: 'жд',
        ľ: 'л',
        ń: 'н',
        ť: 'т',
        t́: 'т',
        ď: 'д',
        d́: 'д',
        ś: 'с',
        ź: 'з',
      })
    )
    .rule('Cyrillic mapping - other', (r) =>
      r.map({
        '’': '',
        ı: '',
        ḓ: '',
      }),
    )
    .rule('Restore case', (r) => r.restoreCase())
    .build();
