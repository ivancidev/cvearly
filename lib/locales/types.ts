export interface TranslationSchema {
  navbar: {
    logo: string;
    howItWorks: string;
    tryItFree: string;
    backHome: string;
    newCv: string;
  };
  footer: {
    privacy: string;
    terms: string;
    docs: string;
    rights: string;
  };
  landing: {
    hero: {
      title: string;
      description: string;
      cta: string;
      badge: string;
    };
    howItWorks: {
      tag: string;
      title: string;
      step1Title: string;
      step1Desc: string;
      step2Title: string;
      step2Desc: string;
      step3Title: string;
      step3Desc: string;
    };
    features: {
      title: string;
      scoreTitle: string;
      scoreDesc: string;
      githubTitle: string;
      githubDesc: string;
      docxTitle: string;
      docxDesc: string;
    };
    faq: {
      title: string;
      subtitle: string;
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      q3: string;
      a3: string;
      q4: string;
      a4: string;
    };
    cta: {
      title: string;
      desc: string;
      cta: string;
    };
  };
  generate: {
    title: string;
    subtitle: string;
    upload: {
      title: string;
      badge: string;
      desc: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      cta: string;
    };
    manual: {
      title: string;
      badge: string;
      desc: string;
      bullet1: string;
      bullet2: string;
      bullet3: string;
      cta: string;
    };
    steps: {
      title: string;
      s1Title: string;
      s1Desc: string;
      s2Title: string;
      s2Desc: string;
      s3Title: string;
      s3Desc: string;
    };
  };
  uploadPage: {
    back: string;
    tag: string;
    title: string;
    desc: string;
    dropzone: {
      ready: string;
      remove: string;
      click: string;
      formats: string;
    };
    github: {
      label: string;
      optional: string;
    };
    jobDescription: {
      label: string;
      placeholder: string;
    };
    extraContext: {
      label: string;
      optional: string;
      placeholder: string;
    };
    errors: {
      fileRequired: string;
      jdRequired: string;
      unsupported: string;
      tooLarge: string;
      geminiLimit: string;
      unexpected: string;
    };
    submit: {
      limitReached: string;
      optimize: string;
    };
    rateLimit: {
      used: string;
      remaining: string;
    };
    loader: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      sub: string;
    };
  };
  manualPage: {
    back: string;
    tag: string;
    title: string;
    desc: string;
    personal: string;
    fullName: {
      label: string;
      placeholder: string;
    };
    email: {
      label: string;
      placeholder: string;
    };
    github: {
      label: string;
      optional: string;
    };
    uploadCv: {
      label: string;
      optional: string;
    };
    jobDescription: {
      label: string;
      placeholder: string;
    };
    extraContext: {
      label: string;
      optional: string;
      placeholder: string;
    };
    errors: {
      personalRequired: string;
      jdRequired: string;
      unsupported: string;
      tooLarge: string;
      geminiLimit: string;
      unexpected: string;
    };
    submit: {
      limitReached: string;
      optimize: string;
    };
    rateLimit: {
      used: string;
      remaining: string;
    };
    loader: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      sub: string;
    };
  };
  resultPage: {
    loading: string;
    noCv: {
      title: string;
      desc: string;
      cta: string;
    };
    success: {
      title: string;
      desc: string;
    };
    actions: {
      generateAgain: string;
    };
  };
}
