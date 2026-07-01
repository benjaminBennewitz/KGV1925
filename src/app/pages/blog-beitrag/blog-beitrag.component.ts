/* src/app/pages/blog-beitrag/blog-beitrag.component.ts */

import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { BLOG_BEITRAEGE } from '../../shared/data/blog-beitraege.data';

@Component({
  selector: 'app-blog-beitrag',
  imports: [RouterLink],
  templateUrl: './blog-beitrag.component.html',
  styleUrl: './blog-beitrag.component.scss',
})
export class BlogBeitragComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly beitraege = BLOG_BEITRAEGE;
  protected readonly slug = toSignal(this.route.paramMap.pipe(map((parameter) => parameter.get('slug') ?? '')), { initialValue: '' });
  protected readonly beitrag = computed(() => this.beitraege.find((eintrag) => eintrag.slug === this.slug()) ?? this.beitraege[0]);
}
