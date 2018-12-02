+++
title= "Spirit X3 Error Handling"
date= 2018-12-03
archives= "2018"
tags= ["C++", "Spirit X3", "Boost"]
draft = true
+++
Once your parser grammar grows beyond a few rules/parsers, handling errors will become a priority. Being able to give feedback about where things went wrong, what exactly went wrong, and possible fixes are all things you would like to provide. It might also be nice to see if you could recover the parsing process from the point of failure and continue parsing to maybe find other problems.

All code can be found on [github](https://github.com/mhhollomon/blogcode).

### V1 - The problem.

If you have read the other posts I've written on using Boost::Spirit, you will be familiar with this grammar:

```
auto const kw_var = mkkw("var");
auto const kw_func = mkkw("func");

auto const ualnum = alnum | char_('_');
auto const reserved = lexeme[symtab >> !ualnum];
auto const ident = lexeme[ *char_('_') >> alpha >> *ualnum ] - reserved;

auto const vardec = kw_var >> ident >> ';' ;
auto const funcdec = kw_func >> ident >> ';' ;

auto const stmt = vardec | funcdec ;

auto const program = +stmt;
```

Statements are either `var foo;` or `func foo;`  repeated until you get bored. The two keywords are reserved.

And v1 works fine.

```
> ./v1 "var foo ; func bar; func baz;"
parsing : var foo ; func bar; func baz;
Good input
> ./v1 "var foo; func bar func baz"
parsing : var foo; func bar func baz
Failed: didn't parse everything
stopped 17 characters from the end ( 'f' )
```

But look at the error case for a minute.

First, the main parser returned success, even though it didn't parse everything - which is fine. But look at the location it returned - the "f" in "func bar". That would be correct as well. That is as far as it could correctly parse. But it is only minimally helpful in deciding what is wrong.

The problem here is actually a feature - backtracking. If a parser cannot parse something, it will shrug it off and return so something else could try.

We use this to our advantage in the line:

```
auto const stmt = vardec | funcdec ;
```

If `vardec` failed to see the keyword `var` and threw up its hands in disgust, this would never work. Instead, it returns and allows `funcdec` to take a crack at it.

This allows parsers to be composable with very little fuss. You don't have to worry about common prefixes causing issues.

To be sure, backtracking can eat up time, so you do want to think about your grammar; but for small grammars or prototypes, it can be a blessing.

### V2 - setting expectations.

But we can do a little better, and Spirit can help.

Because of the way the grammar is defined, we know that once we see the `var` keyword, we better see an ident. Nothing else will do. And really, there is no point in backtracking, nothing else will match the `var`. And same thing for the "ident". There had better be a semi-colon - nothing else will do. So let's tell Spirit that by using the expectation operator `>` rather than the sequence operator `>>`.

```
auto const vardec = kw_var > ident > ';' ;
auto const funcdec = kw_func > ident > ';' ;
```

So we make those changes, run with the error string and...

```
$ ./v2 "var foo; func bar func baz"
parsing : var foo; func bar func baz
terminate called after throwing an instance of 'boost::exception_detail::clone_impl<boost::exception_detail::error_info_injector<boost::spirit::x3::expectation_failure<__gnu_cxx::__normal_iterator<char const*, std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > > > > >'
  what():  boost::spirit::x3::expectation_failure
```

It throws an exception. But note that `what()` line at the end. That is Spirit telling us we didn't meet an expectation. So, actually it worked. Since "Success" means we parsed and "Fail" means backtrack and try something else, the only way the expectation operator has to tell us there is a problem is to throw an exception.

Now, we could use try/catch to grab the exception. And a little sleuthing would show that the object also has a `where()` that returns an iterator. That iterator points to the character that failed to meet our expectation. It also has a `which()` that shows .. err.. which parser failed (in the example it would be ';'). Sounds perfect.

But we're going to do something even better.

### V3 - Tag and release

When you create a rule (rather than a bare parser), one of the pieces of info you give to the template is a unique "tag type". The tag type is used by the meta-programming magic in Spirit as a kind of identifier for the rule. Meta-programming can't easily get at the names of things, but can get at types.

```
struct my_rule_tag {};
x3::rule<my_rule_tag>const my_rule = "my_rule"
auto const my_rule_def = .....
BOOST_SPIRIT_DEFINE(my_rule)
```

But the tag type can do other things.

The interesting one for our purposes is error handing. If the tag type has a public template member function named `on_error()`, Spirit will call that instead of throwing the error. So, lets turn `stmt` into a rule and see what the handler looks like.

First, the lines for `stmt` itself.

```
x3::rule<stmt_tag> const stmt = "stmt";
auto const stmt_def = vardec | funcdec ;
auto const program = +stmt;
BOOST_SPIRIT_DEFINE(stmt);
```

Now the definition of stmt_tag:

```
struct stmt_tag {

template <typename Iterator, typename Exception, typename Context>
   x3::error_handler_result on_error(
      Iterator& first, Iterator const& last, Exception const& x,
      Context const& context)
   {
     /* error code goes here */
     return x3::error_handler_result::fail;
   }
};
```
