# App Store and Google Play preparation

This is a local prototype. Store policies can change, and each submission is reviewed individually. This checklist does not guarantee approval.

## Publishing rights

- Obtain written permission from the rights holder for each Spanish edition to reproduce and distribute the complete text digitally in a mobile app, including offline access when applicable.
- Confirm rights separately for the original work, Spanish translation, editorial revision, notes, foreword, illustrations, cover, page design, and digital file. Possessing a PDF does not grant distribution rights.
- Record the works and versions, rights holder, platforms, territories, languages, term, free or paid model, and permission for technical conversion, previews, and promotional materials.
- Keep contracts, permission records, attribution requirements, and required notices.
- Do not assume that an original work, translation, or digital edition is public domain based only on the author's date of death. Review the laws in each target territory with appropriate counsel.
- Do not include `lemalar_tr.pdf` or other unlicensed material in the repository, app resources, builds, store screenshots, metadata, or review package.

## Languages and content

- During development, the interface supports English and Spanish. The first launch follows the device language if it is English or Spanish, and falls back to Spanish otherwise. A manual choice is saved locally.
- Before release, remove English as an interface option and remove English interface copy; Spanish should be the only supported interface language. Recheck accessibility labels, alerts, empty states, navigation headers, metadata, and store screenshots.
- The current Spanish sample chapters are fictional demo content. Replace them with authorized editions or clearly suitable original material before public release. Do not present the Turkish Lemalar test text as Spanish content or as an authorized edition.
- Keep store listings and screenshots accurate about both the interface language and the language of the books.

## Functionality and review

- Remove the development-only Lemalar text entry and extracted Turkish text from release builds. Verify release artifacts before submission.
- Review Apple's minimum functionality guideline (4.2) and Google Play's functionality, content, and user experience policy. A catalog made only of static text or PDFs may be rejected. Search, multiple books, reading progress, bookmarks, offline reading, and reader controls are a foundation, not a guarantee; provide enough useful, stable, and distinctive content.
- Test navigation, search, progress restoration, bookmarks, offline reading, text sizing, accessibility, small and large screens, empty states, and restarts on simulators and physical devices.
- Confirm the permanent identifier `com.lumbre.reader`, select final icons, and prepare Spanish store listings and licensed promotional images. Ensure listings and screenshots match the final app.
- Give reviewers working access and clear test instructions. Remove temporary copy and confirm all store links work.

## Privacy and data

- The current prototype stores reading progress, bookmarks, interface choice on-device. It has no account, sync service, ads, analytics, or purchase flow. Confirm the behavior of every dependency in the exact release build.
- Publish a privacy policy accessible from the app and both store listings. Describe actual data handling, purposes, retention, providers, user rights, and contact details as applicable.
- Complete App Store Connect privacy details and Google Play's Data safety section accurately, including third-party SDK behavior. Update them whenever the app's practices change.
- If accounts are added later, implement and test a clear account deletion request path and comply with the stores' current requirements.

## Digital purchases

- This prototype has no purchases, payment links, or paid unlocks.
- Before selling books, subscriptions, or digital features in the app, review the payment rules for each store, platform, and territory. Digital sales generally use Apple's in-app purchase or Google Play Billing unless a specific exception or approved program applies.
- Apple's reader app category and external link entitlement have eligibility criteria and terms; they are not a general exemption. Confirm current terms and any required entitlement before adding external purchase links or instructions.
- If readings are free, describe that model clearly and do not show nonfunctional purchase controls.

## Official references checked (November 17, 2026)

- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/): intellectual property, privacy, and minimum functionality.
- [Apple reader apps](https://developer.apple.com/support/reader-apps/): eligibility and conditions for external account links.
- [App Store privacy details](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/): privacy policy and data declarations.
- [Google Play intellectual property policy](https://support.google.com/googleplay/android-developer/answer/9888072): original or authorized content, including books and translations.
- [Google Play functionality, content, and user experience policy](https://support.google.com/googleplay/android-developer/answer/9898783): static or low-utility content and stability.
- [Google Play user data policy](https://support.google.com/googleplay/android-developer/answer/10144311): privacy policy and Data safety section.
- [Google Play payments policy](https://support.google.com/googleplay/android-developer/answer/9858738): charges for digital content and features, subject to exceptions.
- [Expo TypeScript guide](https://docs.expo.dev/guides/typescript/) and [Expo SDK reference](https://docs.expo.dev/versions/latest/): platform support and compatibility.
