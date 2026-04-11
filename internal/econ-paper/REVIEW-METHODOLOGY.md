# Automated 3-Pass Research Review: AI-Augmented Academic Quality Control

## What This Is

A systematic, automated review pipeline applied to an economics research paper on the returns to institutional prestige and academic discipline. The pipeline executes three sequential passes --- code audit, statistical strengthening, and prose polish --- that together replicate the depth of a thorough peer review in a fraction of the time.

Brady built the original paper. Then he built an automated review pipeline that improved it further. Both are skills.

---

## The 3-Pass Pipeline

### Pass 1: Code Audit

Sequential walk-through of every R code chunk in the .Rmd file, checking:

- **Execution viability**: Does each chunk run given the data pipeline above it?
- **Variable definitions**: Are all referenced variables defined? Are column names correct?
- **Function arguments**: Correct parameter names, valid argument combinations?
- **Join integrity**: Correct merge keys, no accidental row duplication?
- **Statistical correctness**: Appropriate methods, valid inference?
- **Output formatting**: Do table/figure specifications produce correct output?

### Pass 2: Statistical Strengthening

Using only the dataframes and variables already constructed in the paper, write new analyses that address gaps or strengthen existing claims. Criteria for inclusion:

- Does it test a stated limitation?
- Does it address an implicit assumption?
- Does it provide a robustness check from a different angle?
- Does it add methodological rigor that a reviewer would expect?

### Pass 3: Prose Polish

Read every paragraph of non-code text and apply three filters:

- **Tighten**: Remove bloat, redundancy, and unnecessary hedging
- **Sharpen**: Make claims match what the code actually produces
- **Elevate**: Write for the reader who has 30 seconds to decide if this person is sharp

---

## Pass 1 Findings: Code Audit

**Total issues found: 8**

| # | Chunk | Severity | Issue | Fix |
|---|-------|----------|-------|-----|
| 1 | `data-dictionary` | **CRITICAL** | Variable vector has 26 entries; Description, Source, and Type vectors have 24 each. Missing `log_ugds` and `high_prestige`. Tibble creation fails at runtime. | Added 2 entries to each vector. |
| 2 | `table4-stargazer` | **MAJOR** | Both `omit.labels`/`omit.yes.no` and `add.lines` specified --- creates duplicate "Fixed Effects: Yes/No" indicator rows in regression table. | Removed `omit.labels` and `omit.yes.no`; kept `add.lines` for manual control. |
| 3 | `table5-stargazer-log` | **MAJOR** | Same duplication: 3 `omit.labels` entries + 3 `add.lines` entries = 6 indicator rows instead of 3. | Same fix. |
| 4 | `table-robustness-5yr` | **MAJOR** | Same duplication pattern as Tables 4 and 5. | Same fix. |
| 5 | `variance-decomposition` | **MINOR** | `residual_ss` and `total_explained_ss` computed but never referenced. Dead code. | Removed both lines. |
| 6 | `quantile-regression` | **MINOR** | Bootstrap replications set to R=200. Standard practice recommends R>=500 for stable standard errors. | Changed to R=500 in all three `summary()` calls. |
| 7 | `build-dataset` | **MINOR** | CIP code extraction (`as.integer(cipcode) %/% 100`) assumes 4-digit integer format. Works for current data but fragile if format changes. | Flagged; no change (works correctly with Scorecard format). |
| 8 | `fig-geographic` | **MINOR** | Uses deprecated `do()` from dplyr. Suppressed by `warning = FALSE` but technically deprecated. | Flagged; no change (still functional, warnings suppressed). |

**Summary by severity:**
- Critical: 1
- Major: 3
- Minor: 4

The critical bug (mismatched vector lengths in the data dictionary) would have caused a runtime crash. The three major bugs (duplicate stargazer rows) would have produced visually incorrect regression tables with redundant indicator lines.

---

## Pass 2 Additions: Statistical Strengthening

**4 new analyses added:**

### 1. Multicollinearity Diagnostics (VIF Check)

**Chunk**: `vif-check` (hidden, results reported inline)
**Location**: After model estimation, before results interpretation
**Justification**: With 10+ control variables including correlated measures (Pell share, first-gen share, graduation rate), reviewers routinely ask about multicollinearity. Variance Inflation Factors provide a standard diagnostic. Result reported inline in the interpretation section.

### 2. Joint Wald Test for Interaction Significance

**Chunk**: `joint-f-test` (hidden, results reported inline)
**Location**: After Table 6 (interaction coefficients), before Figure 4
**Justification**: The paper presents 22 individual interaction coefficients, but never tests whether they are *jointly* significant. A reviewer would ask: "Is the prestige gradient truly heterogeneous across disciplines, or could these differences be noise?" The Wald test answers this definitively.

### 3. Prestige Index Sensitivity Analysis

**Chunk**: `sensitivity-admrate` (Table 10)
**Location**: New subsection at end of Robustness section
**Justification**: The paper's Limitations section explicitly flags that "different weighting choices produce somewhat different tier assignments." This analysis tests the claim by replacing the composite index with selectivity alone and comparing coefficients and model fit.

### 4. Public vs. Private Prestige Premium

**Chunk**: `public-private-heterogeneity` (Table 11)
**Location**: New subsection after sensitivity analysis
**Justification**: The paper controls for institutional sector but never asks whether the prestige gradient differs across public and private institutions. This is a natural heterogeneity test --- public universities operate under different wage structures, hiring networks, and regional labor market dynamics than private institutions. The interaction test directly addresses this.

---

## Pass 3 Rewrites: Prose Polish

### Example 1: Introduction Opening

**Before** (61 words):
> Higher education in the United States commands a substantial wage premium over a high school diploma, a finding replicated across decades of labor-market research (Card, 1999; Goldin & Katz, 2008). Yet treating a "college degree" as a homogeneous credential ignores two dimensions that labor economists and prospective students alike recognize as critical: *where* one attends and *what* one studies.

**After** (52 words):
> A bachelor's degree commands a substantial wage premium over a high school diploma --- a finding so robust it has survived fifty years of empirical scrutiny (Card, 1999; Goldin & Katz, 2008). But treating 'college degree' as a homogeneous credential ignores the two dimensions that actually determine what that degree is worth: *where* you earn it and *what* you study.

**Why**: Opens with authority. "Fifty years of empirical scrutiny" is more concrete than "decades of labor-market research." Direct second-person ("where you earn it") creates immediacy.

### Example 2: Results Interpretation

**Before** (54 words):
> Model 1 establishes that a one-standard-deviation increase in the prestige index is associated with a meaningful and statistically significant increase in median graduate earnings. This estimate shrinks somewhat but remains significant when discipline fixed effects are added in Model 3, confirming that prestige carries an independent earnings premium beyond the mix of fields offered at a given institution.

**After** (38 words):
> A one-standard-deviation increase in prestige is associated with a significant increase in median graduate earnings (Model 1). Adding discipline fixed effects in Model 3 shrinks the estimate but does not eliminate it: prestige carries an independent premium beyond a school's mix of fields.

**Why**: Removed "meaningful and" (redundant with "significant"). "Shrinks somewhat but remains significant" → "shrinks... but does not eliminate it" is more precise and forceful.

### Example 3: Conclusion

**Before** (42 words):
> From a broader policy standpoint, students and families should recognize that the discipline chosen is at least as important a determinant of early-career earnings as the selectivity of the school. The program-level earnings transparency the College Scorecard provides is precisely the kind of information that can support these consequential decisions.

**After** (31 words):
> The broader message is simple: what you study is at least as important as where you study it. The College Scorecard makes program-level earnings data publicly available. High school counselors, financial aid offices, and first-generation students should be using it.

**Why**: Stripped the passive policy-speak. Named specific audiences. Ended with a call to action, not a statement of principle.

### Example 4: Abstract (New)

The original paper had no abstract. Added a 120-word abstract that a hiring manager reads in 30 seconds: data source, method, three findings, implication. Uses inline R to dynamically populate the observation count.

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total issues found (Pass 1) | 8 |
| Critical issues | 1 |
| Major issues | 3 |
| Minor issues | 4 |
| New code chunks added (Pass 2) | 4 |
| New tables added | 2 (Tables 10, 11) |
| Prose sections rewritten (Pass 3) | 5 |
| Total lines changed | 84 net new (1,692 → 1,776) |
| Original file | ECO495_improved.Rmd |
| Final file | ECO495_final.Rmd |

---

## What This Demonstrates

Academic papers contain bugs. Not the kind that crash a program (though this one had that too), but the kind that produce subtly wrong tables, untested assumptions, and claims that don't match the code. A human reviewer catches some of these --- eventually, after hours of line-by-line reading. An AI-augmented review pipeline catches them systematically, in a single pass, with explicit severity ratings and fixes.

The value is not that the AI wrote the paper. Brady built the original: the research question, the data pipeline, the econometric strategy, the interpretation. The value is that the AI ran a review process that would take a human reviewer hours --- checking every function call, every variable reference, every statistical assumption --- and delivered a categorized list of issues with fixes, plus four new analyses that strengthen the paper's claims.

This is what AI-augmented research workflows look like: the human does the thinking, the AI does the systematic verification. Both are necessary. Neither is sufficient alone.
