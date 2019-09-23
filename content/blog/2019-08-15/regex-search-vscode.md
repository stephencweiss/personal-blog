---
title: 'Regex Search in VSCode'
date: '2019-08-15'
category: ['programming']
tags: ['regex','vscode']
---

Finding all instances of an imported module in a large app can be challenging.

With the namespace for a module being restricted to the file, searching for a specific name can often lead you astray. The same name can be used for wildly different purposes across the app.

Furthermore, even if you what you’re looking for is only instances where a module has been imported, due to destructuring and the possibility of multiple imports from that resource, the results can be overwhelming to search through.

Take for instance my search for all instances where I imported `Input` from a library, `repaint`.

Searching for just Input I had ~1,500 results.
![](./input-reseults-1500.png)

I could narrow that a bit by searching to for `repaint`, but I still had 300+ results in 250+ files.
![](./regex-results-19.png)

This is where Regex really shines. I know the module being imported and the library’s name, but because the pattern of import can change so much, finding them can be hard if I’m looking for an exact match.

I’m no expert, but after a few minutes with some resources I found the pattern I needed: `input(.*)repaint`.<sup>1</sup>

The pattern is specifying a very simple pattern: the strings  `input` and `repaint` separated by any characters. Even this generic, basic pattern cut my results from hundreds or thousands … to 19. That’s efficiency.
![](./repaint-results-323.png)

NB: The Regex option needs to be turned on for this to work (select the  `.*` icon or use the keyboard shortcut `⌥⌘R`)

## Footnotes
* <sup>1</sup> [Regex: Everything You Need To Know | CodePicky](https://www.codepicky.com/regex/)
