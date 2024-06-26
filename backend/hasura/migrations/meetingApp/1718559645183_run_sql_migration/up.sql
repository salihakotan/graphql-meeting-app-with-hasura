CREATE OR REPLACE FUNCTION public.user_full_name(user_row users)
    RETURNS TEXT
    LANGUAGE sql
    STABLE
AS $function$
    SELECT user_row.name || ' ' || user_row.surname
$function$;
