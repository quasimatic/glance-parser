GlanceReference = scopes:ScopeRight+ subject:Subject? {return subject? scopes.concat([subject]) : scopes}
  / subject:Subject? scopes:ScopeLeft+ { return subject? scopes.reverse().concat([subject]) : scopes }
  / subject:Subject {return [subject]}
  / .* {return []}

ScopeRightChar = ">"
ScopeLeftChar = "<"
ScopeChar = ScopeRightChar / ScopeLeftChar
IntersectChar = "^"
OptionChar = "#"

ScopeRight = intersections:Intersection+ ScopeRightChar {return intersections}
ScopeLeft = ScopeLeftChar intersections:Intersection+ {return intersections}
Subject = intersections:Intersection+ {return intersections}
Intersection = target:Target IntersectChar? {return target}

Target = label:LabelCharacter+ options:Options? Whitespace? {
  return {
    label: label.join('').trim(),
    options: options || []
  }
}
/
options:Options Whitespace? {
  return {
    options: options || []
  }
}

LabelCharacter
  = !(EscapableChars) c:. { return c }
  / EscapedSequence

Options = OptionChar options:Option* { return options; }

Option = name:Character+  OptionChar? { return name.join("").trim() }

EscapeChar = "\\"
EscapableChars = EscapeChar / ScopeChar / OptionChar / IntersectChar

EscapedSequence = EscapeChar c:(EscapableChars) { return c }

Character = !(EscapableChars) c:. { return c }

Whitespace = [ \t\r\n]+