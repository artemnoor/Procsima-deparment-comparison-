import type { DirectionLearningContent } from "@/shared/kernel/direction";

type LearningContentBlockProps = {
  learningContent: DirectionLearningContent;
  variant?: "detail" | "compact";
};

function pickVisibleItems<T>(items: T[], variant: "detail" | "compact"): T[] {
  return variant === "compact" ? items.slice(0, 2) : items;
}

export function LearningContentBlock(props: LearningContentBlockProps) {
  const { learningContent, variant = "detail" } = props;
  const visibleOutcomes = pickVisibleItems(learningContent.outcomes, variant);
  const visibleTechnologies = pickVisibleItems(
    learningContent.technologies,
    variant,
  );
  const visibleSkills = pickVisibleItems(
    learningContent.practicalSkills,
    variant,
  );
  const visibleStudyFocuses = pickVisibleItems(
    learningContent.studyFocuses,
    variant,
  );

  return (
    <div className={`learningContentBlock learningContentBlock${variant}`}>
      <section className="learningContentSection">
        <h3 className="cardTitle">What you will learn</h3>
        <p className="muted">
          {learningContent.summary ?? "Structured learning-content is pending."}
        </p>
      </section>

      <section className="learningContentSection">
        <h4 className="subsectionTitle">Learning outcomes</h4>
        <div className="learningOutcomeList">
          {visibleOutcomes.length > 0 ? (
            visibleOutcomes.map((outcome) => (
              <article className="learningOutcomeCard" key={outcome.title}>
                <strong>{outcome.title}</strong>
                <p className="muted">{outcome.description}</p>
              </article>
            ))
          ) : (
            <p className="muted">Outcome details will be added later.</p>
          )}
        </div>
      </section>

      <section className="learningContentSection">
        <h4 className="subsectionTitle">Technology highlights</h4>
        <div className="learningTagList">
          {visibleTechnologies.length > 0 ? (
            visibleTechnologies.map((technology) => (
              <span className="chip" key={technology.name}>
                {technology.name}
              </span>
            ))
          ) : (
            <p className="muted">
              Technology highlights are not available yet.
            </p>
          )}
        </div>
      </section>

      <section className="learningContentSection">
        <h4 className="subsectionTitle">Practical skills</h4>
        <div className="learningSkillList">
          {visibleSkills.length > 0 ? (
            visibleSkills.map((skill) => (
              <article className="learningSkillCard" key={skill.name}>
                <strong>{skill.name}</strong>
                <p className="muted">
                  {skill.context ?? "Practice context pending"} - {skill.level}
                </p>
              </article>
            ))
          ) : (
            <p className="muted">Practical skills are not available yet.</p>
          )}
        </div>
      </section>

      <section className="learningContentSection">
        <h4 className="subsectionTitle">Study focus</h4>
        <div className="studyFocusGrid">
          {visibleStudyFocuses.length > 0 ? (
            visibleStudyFocuses.map((focus) => (
              <article className="studyFocusCard" key={focus.title}>
                <strong>{focus.title}</strong>
                <p className="muted">{focus.summary}</p>
                <div className="learningTagList">
                  {focus.subjectBlocks.map((subjectBlock) => (
                    <span className="chip chipMuted" key={subjectBlock}>
                      {subjectBlock}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <p className="muted">Study focus blocks are not available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
