# Prestige, Discipline, and the Economic Returns to a Bachelor's Degree

**Evidence from the U.S. College Scorecard**

An empirical analysis of how institutional prestige and academic discipline interact to shape graduate earnings in the United States. The paper constructs a composite prestige index from admission rates, SAT scores, and instructional expenditure, then estimates OLS models showing that (1) field of study is the single largest predictor of early-career earnings, (2) prestige carries a significant but comparatively modest premium, and (3) the prestige premium is heterogeneous across disciplines --- largest in engineering, computer science, and business, and smallest in education, arts, and humanities.

## Key Finding

What you study matters more than where you study it. A variance decomposition shows discipline fixed effects account for the majority of explained earnings variation. The prestige premium exists, but it is not uniform --- it amplifies returns in competitive, market-oriented fields and adds little in fields where wages are set by certification or institutional pay scales.

## Methods

- **OLS regression** with progressively richer specifications (prestige only, discipline FE, interaction model)
- **Propensity score matching** comparing observationally similar institutions across prestige tiers
- **Quantile regression** at the 25th, 50th, and 75th percentiles of the earnings distribution
- **Type II ANOVA variance decomposition** quantifying the relative contributions of prestige, discipline, and controls
- **Geographic heterogeneity analysis** estimating region-specific prestige premiums
- **Prestige index sensitivity analysis** comparing composite index vs. selectivity-only specification
- **Public vs. private institutional heterogeneity** testing whether the prestige gradient differs by sector
- **Multicollinearity diagnostics** (VIF) and **joint Wald test** for interaction significance

## Data

Two publicly available files from the [College Scorecard](https://collegescorecard.ed.gov/data/): the institution-level file (school characteristics, aggregate outcomes) and the field-of-study file (program-level median earnings at 4 and 5 years post-completion). All data processing, merging, and variable construction is fully reproducible within the .Rmd file.

## Files

| File | Description |
|------|-------------|
| `ECO495_final.Rmd` | Final paper with all code, tables, and figures (production version) |
| `ECO495_improved.Rmd` | Pre-review version (preserved for comparison) |
| `REVIEW-METHODOLOGY.md` | Documentation of the automated 3-pass review pipeline |

## Technical Stack

- **R** (primary language)
- **tidyverse** (data wrangling, visualization with ggplot2)
- **gt** / **gtExtras** (publication-quality tables)
- **stargazer** (regression output tables)
- **sandwich** / **lmtest** (clustered standard errors)
- **MatchIt** (propensity score matching)
- **quantreg** (quantile regression)
- **car** (Type II ANOVA, VIF diagnostics)

## Process

The paper went through three development stages:

1. **Original draft** --- built independently using free-tier Claude as a test of AI-assisted research workflows
2. **Improved version** (`ECO495_improved.Rmd`) --- substantially enhanced with propensity score matching, quantile regression, variance decomposition, geographic analysis, and expanded discussion
3. **Final version** (`ECO495_final.Rmd`) --- passed through an automated 3-pass review pipeline (code audit, statistical strengthening, prose polish) that found 8 issues (1 critical, 3 major), added 4 new analyses, and tightened the prose throughout

The review pipeline itself is documented in [`REVIEW-METHODOLOGY.md`](REVIEW-METHODOLOGY.md) as a standalone portfolio piece demonstrating AI-augmented research quality control.

## About

Built by **Braden D'Angelo** (M.S. Applied Statistics, Grand Valley State University) as a skills demonstration combining applied econometrics, reproducible research in R, and AI-augmented workflows. The paper demonstrates competency in causal inference methodology, data pipeline construction, and statistical communication for technical audiences.
